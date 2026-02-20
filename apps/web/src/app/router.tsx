import { AuthState } from "../types/auth";
import { AuthGate } from "../features/auth/AuthGate";
import { LoginPage } from "../features/auth/LoginPage";
import { AnalysisWorkbench } from "../features/analysis/AnalysisWorkbench";

export interface AppRoute {
  path: string;
  public: boolean;
  render: (authState: AuthState) => string;
}

export const appRoutes: AppRoute[] = [
  {
    path: "/login",
    public: true,
    render: () => LoginPage()
  },
  {
    path: "/app",
    public: false,
    render: (authState) =>
      AuthGate({
        state: authState,
        redirectTo: "/login",
        children: AnalysisWorkbench(authState.user)
      })
  }
];
