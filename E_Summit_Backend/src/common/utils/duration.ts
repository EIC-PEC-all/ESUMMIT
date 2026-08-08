const UNIT_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/**
 * Converts a JWT-style duration string ("15m", "7d", "900s") to milliseconds.
 * Kept in step with the same strings handed to @nestjs/jwt so the DB expiry we
 * persist for a refresh token cannot drift from the token's own lifetime.
 */
export function durationToMs(duration: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(duration.trim());

  if (!match) {
    throw new Error(
      `Invalid duration "${duration}". Expected a number followed by s, m, h, or d (e.g. "15m").`,
    );
  }

  return Number(match[1]) * UNIT_MS[match[2]];
}
