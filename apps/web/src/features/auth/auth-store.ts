import { AuthState } from "../../types/auth";
import { fetchMe } from "./auth-api";

type Listener = (state: AuthState) => void;

export class AuthStore {
  private state: AuthState = { status: "loading", user: null };
  private readonly listeners = new Set<Listener>();

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async bootstrap(): Promise<void> {
    this.setState({ status: "loading", user: null });
    const me = await fetchMe();
    if (!me) {
      this.setState({ status: "unauthenticated", user: null });
      return;
    }
    this.setState({ status: "authenticated", user: me.user });
  }

  setUnauthenticated(): void {
    this.setState({ status: "unauthenticated", user: null });
  }

  private setState(next: AuthState): void {
    this.state = next;
    this.listeners.forEach((listener) => listener(this.state));
  }
}
