import { AuthState } from "../../types/auth";

export interface AuthGateProps {
  state: AuthState;
  redirectTo: string;
  children: string;
}

export function AuthGate(props: AuthGateProps): string {
  if (props.state.status === "loading") {
    return "Loading session...";
  }
  if (props.state.status === "unauthenticated") {
    return `Redirect:${props.redirectTo}`;
  }
  return props.children;
}
