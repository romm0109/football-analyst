export type SessionSameSite = "lax" | "strict" | "none";

export interface AuthConfig {
  nodeEnv: string;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  webBaseUrl: string;
  sessionSecret: string;
  sessionTtlSeconds: number;
  sessionCookieName: string;
  sessionCookieDomain?: string;
  sessionSameSite: SessionSameSite;
  cookieSecure: boolean;
}

const REQUIRED_KEYS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "WEB_BASE_URL",
  "SESSION_SECRET"
] as const;

export function buildAuthConfig(env: NodeJS.ProcessEnv): AuthConfig {
  for (const key of REQUIRED_KEYS) {
    if (!env[key]) {
      throw new Error(`Missing required auth env var: ${key}`);
    }
  }

  const nodeEnv = env.NODE_ENV ?? "development";
  const secureByDefault = nodeEnv !== "development" && nodeEnv !== "test";
  const sessionSameSite = (env.SESSION_SAME_SITE ?? "lax").toLowerCase() as SessionSameSite;

  return {
    nodeEnv,
    googleClientId: env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET as string,
    googleCallbackUrl: env.GOOGLE_CALLBACK_URL as string,
    webBaseUrl: env.WEB_BASE_URL as string,
    sessionSecret: env.SESSION_SECRET as string,
    sessionTtlSeconds: Number(env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7),
    sessionCookieName: env.SESSION_COOKIE_NAME ?? "fa.sid",
    sessionCookieDomain: env.SESSION_COOKIE_DOMAIN,
    sessionSameSite,
    cookieSecure: secureByDefault
  };
}
