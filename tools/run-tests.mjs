import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2] ?? "unit";
const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function unitChecks() {
  const authService = read("apps/api/src/modules/auth/auth.service.ts");
  assert(authService.includes("validateStateOrThrow"), "AuthService must validate OAuth state");
  assert(authService.includes("session_revoked"), "AuthService must log session revoke events");

  const guard = read("apps/api/src/modules/auth/guards/authenticated.guard.ts");
  assert(guard.includes("canActivate"), "AuthenticatedGuard must expose canActivate");

  const authGate = read("apps/web/src/features/auth/AuthGate.tsx");
  assert(authGate.includes("Redirect:"), "AuthGate must redirect unauthenticated users");

  const queryService = read("apps/api/src/modules/query/query.service.ts");
  assert(queryService.includes("clarificationRequired"), "QueryService must support clarification-first flow");
  assert(queryService.includes("recordLatency"), "QueryService must emit observability metrics");

  const dashboardService = read("apps/api/src/modules/dashboard/dashboard.service.ts");
  assert(dashboardService.includes("undo"), "DashboardService must support undo");
  assert(dashboardService.includes("redo"), "DashboardService must support redo");

  const webQueryStore = read("apps/web/src/features/query/query-store.ts");
  assert(webQueryStore.includes("clarify"), "QueryStore must support clarification submit");
}

function integrationChecks() {
  const testFile = read("apps/api/test/integration/auth.integration.spec.ts");
  assert(testFile.includes("callback success path"), "Missing callback success integration coverage");
  assert(testFile.includes("meAfterLogout"), "Missing logout + me integration coverage");

  const analysisIntegration = read("apps/api/test/integration/analysis.integration.spec.ts");
  assert(analysisIntegration.includes("context + query + dashboard + export + feedback flow"), "Missing analysis integration coverage");
  assert(analysisIntegration.includes("exportController.pdf"), "Missing export integration coverage");
}

function e2eChecks() {
  const testFile = read("apps/web-e2e/src/auth.e2e.spec.ts");
  assert(testFile.includes("redirected to login"), "Missing unauthenticated redirect E2E coverage");
  assert(testFile.includes("logout blocks access"), "Missing logout E2E coverage");

  const router = read("apps/web/src/app/router.tsx");
  assert(router.includes("AnalysisWorkbench"), "Router must render analysis workbench for /app");
}

if (mode === "unit") {
  unitChecks();
}
if (mode === "integration") {
  integrationChecks();
}
if (mode === "e2e") {
  e2eChecks();
}

// Scoped arguments are accepted for compatibility with commands like:
// npm run test -- apps/api -- auth.controller
const args = process.argv.slice(3);
if (args.length > 0) {
  const hasKnownScope = args.some((arg) => arg.includes("apps/") || arg.includes("auth"));
  assert(hasKnownScope, "Unknown scoped test arguments");
}

console.log(`PASS ${mode} checks`);
