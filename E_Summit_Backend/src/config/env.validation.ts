import { z } from 'zod';

/**
 * Fail-fast environment contract. The app refuses to boot if a required
 * variable is missing or malformed, so a misconfigured deploy surfaces at
 * startup rather than at the first request that happens to need the value.
 *
 * Secrets that are only needed by a not-yet-implemented module are optional
 * here and validated by that module when it lands.
 */
export const envSchema = z.object({
  // ── Runtime ──
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),

  // ── Data stores ──
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),

  // ── Auth (§4.1) ──
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  AUTH_COOKIE_DOMAIN: z.string().optional(),

  // ── QR / gate check-in (§5.1) ──
  QR_HMAC_SECRET: z.string().min(32, 'QR_HMAC_SECRET must be at least 32 characters'),

  // ── Not yet wired: validated when their modules land ──
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Invalid environment configuration:\n${details}\n\nCopy .env.example to .env and fill in the required values.`,
    );
  }

  return parsed.data;
}
