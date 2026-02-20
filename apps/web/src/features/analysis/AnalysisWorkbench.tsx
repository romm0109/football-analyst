import { AuthUser } from "../../types/auth";

export function AnalysisWorkbench(user: AuthUser | null): string {
  if (!user) {
    return "No active user";
  }
  return `Football Analyst Workbench for ${user.name}`;
}
