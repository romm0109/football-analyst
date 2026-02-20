import { AuthState } from "../../types/auth";

export interface RequireAuthResult {
  allowed: boolean;
  redirectTo?: string;
}

export function useRequireAuth(state: AuthState, loginPath = "/login"): RequireAuthResult {
  if (state.status === "authenticated") {
    return { allowed: true };
  }

  if (state.status === "loading") {
    return { allowed: false };
  }

  return { allowed: false, redirectTo: loginPath };
}
