export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  id: string;
  expiresAt: string;
}

export interface AuthMeResponse {
  user: AuthUser;
  session: AuthSession;
}

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: AuthUser | null;
}
