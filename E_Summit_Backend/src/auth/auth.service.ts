import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} 
from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { createHmac, randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { durationToMs } from '../common/utils/duration';
import type { AccessTokenPayload } from '../common/types/authenticated-user';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

export interface SessionContext {
  userAgent?: string;
  ipAddress?: string;
}

/** Fields safe to return to a client. Never includes passwordHash. */
const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  phone: true,
  college: true,
  gradYear: true,
  city: true,
  role: true,
  referralCode: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof PUBLIC_USER_SELECT }>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ── Public API ────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, session: SessionContext) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // An unknown referral code is ignored rather than rejected — a delegate should
    // never be blocked from registering because a CA typo'd their code.
    const referrer = dto.referralCode
      ? await this.prisma.user.findUnique({
          where: { referralCode: dto.referralCode.toUpperCase() },
          select: { id: true },
        })
      : null;

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await this.hashPassword(dto.password),
        name: dto.name.trim(),
        phone: dto.phone,
        college: dto.college,
        gradYear: dto.gradYear,
        city: dto.city,
        role: Role.DELEGATE,
        referralCode: await this.generateUniqueReferralCode(),
        referredById: referrer?.id ?? null,
      },
      select: PUBLIC_USER_SELECT,
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role, session);
    return { user, tokens };
  }

  async login(dto: LoginDto, session: SessionContext) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { ...PUBLIC_USER_SELECT, passwordHash: true },
    });

    // Same generic message and a dummy verify on the miss path, so response
    // content and timing don't reveal whether an email is registered.
    if (!user?.passwordHash) {
      await this.dummyVerify();
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { passwordHash: _discarded, ...publicUser } = user;
    const tokens = await this.issueTokens(user.id, user.email, user.role, session);
    return { user: publicUser, tokens };
  }

  /**
   * Rotates a refresh token: the presented token is revoked and a fresh one
   * issued in the same family. Presenting an already-revoked token is treated
   * as theft and kills every token in that family (§4.1 logout/revocation).
   */
  async refresh(rawToken: string | undefined, session: SessionContext) {
    if (!rawToken) throw new UnauthorizedException('Refresh token missing');

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashRefreshToken(rawToken) },
      include: { user: { select: PUBLIC_USER_SELECT } },
    });

    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    if (stored.revokedAt) {
      this.logger.warn(
        `Refresh token reuse detected for user ${stored.userId}; revoking family ${stored.familyId}`,
      );
      await this.revokeFamily(stored.familyId);
      throw new UnauthorizedException('Refresh token has already been used');
    }

    if (stored.expiresAt <= new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const tokens = await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });

      return this.issueTokens(
        stored.user.id,
        stored.user.email,
        stored.user.role,
        session,
        stored.familyId,
        tx,
      );
    });

    return { user: stored.user, tokens };
  }

  /** Revokes the presented token's entire family, ending the session on all tabs. */
  async logout(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return;

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashRefreshToken(rawToken) },
      select: { familyId: true },
    });

    if (stored) await this.revokeFamily(stored.familyId);
  }

  /** §4.1 `GET /auth/me` — current user plus their pass status. */
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...PUBLIC_USER_SELECT,
        registrations: {
          select: {
            passId: true,
            passType: true,
            amountPaid: true,
            tracks: true,
            isCheckedIn: true,
            badgePdfUrl: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Account no longer exists');

    const { registrations, ...profile } = user;
    return { user: profile, passes: registrations };
  }

  // ── Token issuance ────────────────────────────────────────────────────────

  private async issueTokens(
    userId: string,
    email: string,
    role: Role,
    session: SessionContext,
    familyId: string = randomUUID(),
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<IssuedTokens> {
    const payload: AccessTokenPayload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_TTL'),
    });

    // Refresh tokens are opaque, not JWTs: they must be revocable server-side,
    // and only their HMAC is ever persisted.
    const refreshToken = randomBytes(48).toString('base64url');
    const refreshExpiresAt = new Date(
      Date.now() + durationToMs(this.config.getOrThrow<string>('JWT_REFRESH_TTL')),
    );

    await tx.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashRefreshToken(refreshToken),
        familyId,
        userAgent: session.userAgent?.slice(0, 255),
        ipAddress: session.ipAddress,
        expiresAt: refreshExpiresAt,
      },
    });

    return { accessToken, refreshToken, refreshExpiresAt };
  }

  private hashRefreshToken(rawToken: string): string {
    return createHmac('sha256', this.config.getOrThrow<string>('JWT_REFRESH_SECRET'))
      .update(rawToken)
      .digest('hex');
  }

  private async revokeFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  /** Burns comparable CPU on the unknown-email path to flatten timing signal. */
  private async dummyVerify(): Promise<void> {
    try {
      await argon2.verify(
        '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHR2YWx1ZQ$0000000000000000000000000000000000000000000',
        'invalid',
      );
    } catch {
      // Expected — this hash is intentionally unverifiable.
    }
  }

  /** Every user gets a CA referral code; collisions are retried, not ignored. */
  private async generateUniqueReferralCode(): Promise<string> {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const suffix = Array.from(
        randomBytes(6),
        (byte) => alphabet[byte % alphabet.length],
      ).join('');
      const code = `PEC${suffix}`;

      const taken = await this.prisma.user.findUnique({
        where: { referralCode: code },
        select: { id: true },
      });
      if (!taken) return code;
    }

    throw new Error('Could not generate a unique referral code after 5 attempts');
  }
}

export type { User };
