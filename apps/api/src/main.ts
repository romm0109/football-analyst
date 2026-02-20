import { buildAuthConfig } from "./config/auth.config";

export interface SessionMiddlewareOptions {
  secret: string;
  name: string;
  resave: boolean;
  saveUninitialized: boolean;
  proxy: boolean;
  rolling: boolean;
  cookie: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    domain?: string;
    maxAge: number;
  };
  store: {
    type: "connect-pg-simple";
    createTableIfMissing: true;
    tableName: string;
  };
}

export function createSessionMiddlewareOptions(env: NodeJS.ProcessEnv): SessionMiddlewareOptions {
  const config = buildAuthConfig(env);
  return {
    secret: config.sessionSecret,
    name: config.sessionCookieName,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.sessionSameSite,
      domain: config.sessionCookieDomain,
      maxAge: config.sessionTtlSeconds * 1000
    },
    store: {
      type: "connect-pg-simple",
      createTableIfMissing: true,
      tableName: "user_sessions"
    }
  };
}

export interface ProtectedRouteConfig {
  path: string;
  public: boolean;
}

export const API_ROUTE_PROTECTION: ProtectedRouteConfig[] = [
  { path: "/api/v1/auth/google/start", public: true },
  { path: "/api/v1/auth/google/callback", public: true },
  { path: "/api/v1/auth/me", public: false },
  { path: "/api/v1/auth/logout", public: false },
  { path: "/api/v1/catalog/teams", public: false },
  { path: "/api/v1/catalog/competitions", public: false },
  { path: "/api/v1/context", public: false },
  { path: "/api/v1/query", public: false },
  { path: "/api/v1/query/:queryId/clarify", public: false },
  { path: "/api/v1/dashboard/:dashboardId", public: false },
  { path: "/api/v1/dashboard/:dashboardId/edit", public: false },
  { path: "/api/v1/dashboard/:dashboardId/filters", public: false },
  { path: "/api/v1/dashboard/:dashboardId/pin", public: false },
  { path: "/api/v1/dashboard/:dashboardId/unpin", public: false },
  { path: "/api/v1/dashboard/:dashboardId/undo", public: false },
  { path: "/api/v1/dashboard/:dashboardId/redo", public: false },
  { path: "/api/v1/export/pdf", public: false },
  { path: "/api/v1/feedback/rating", public: false },
  { path: "/api/v1/feedback/summary", public: false },
  { path: "/api/v1/ingestion/health", public: false },
  { path: "/api/v1/observability/metrics", public: false },
  { path: "/api/v1/analysis", public: false }
];
