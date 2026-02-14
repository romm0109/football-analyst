# Feature: Bootstrap Understat Shot Map Vertical Slice

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Bootstrap the repository from documentation-only state into a runnable monorepo that delivers one real end-to-end product slice:

- Python Understat microservice fetches real football data
- NestJS server consumes that service through an adapter abstraction
- React client renders one tactical dashboard (Shot Map) on a football pitch
- Minimal query UI maps user text/buttons to the Shot Map view

This implements the highest-value MVP proof: real data, adapter-first architecture, and user-visible tactical output.

UI visual direction is provided by image references that will be added under `ui-images/`; implementation must mirror those references unless a documented technical constraint prevents exact parity.

## User Story

As a football analyst  
I want to view a real shot map for a selected team/match using natural-language-like controls  
So that I can validate tactical insights quickly without manual data wrangling.

## Problem Statement

The current repository contains PRD and agent prompts but no executable application code. Without a concrete vertical slice, architecture remains unvalidated and future implementation risk stays high (tooling, data contracts, integration behavior, and performance are all unknown).

## Solution Statement

Create a thin but production-shaped vertical slice with strict interface boundaries:

1. Initialize Nx workspace in-place.
2. Generate NestJS + React apps and a shared types library.
3. Add a standalone Python Understat service with normalized response models.
4. Implement a NestJS `IFootballAdapter` + Understat adapter over HTTP.
5. Implement a React Shot Map dashboard with team/match filters and query shortcuts.
6. Add unit/integration tests and validation commands.

This proves architecture decisions in `PRD.md` while keeping scope small enough for fast delivery.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: Workspace tooling, backend API, Python data service, frontend UI, shared contracts, testing  
**Dependencies**: Nx, NestJS, React + Vite, FastAPI, `understat`, Axios/HTTP client, React Query, Recharts (optional for next slice), test runners

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `PRD.md:11` - Why: Non-negotiable architecture decision (no mock data, adapter abstraction, Python Understat first).
- `PRD.md:81` - Why: `IFootballAdapter` explicitly in MVP scope.
- `PRD.md:83` - Why: Python Understat service explicitly in MVP scope.
- `PRD.md:449` - Why: Confirms provider strategy (Understat now, pluggable adapters later).
- `PRD.md:566` - Why: Baseline adapter interface contract to mirror.
- `PRD.md:780` - Why: Intended implementation phases and ordering.
- `PRD.md:1030` - Why: "No Mock Data" directive for data source policy.
- `PRD.md:1038` - Why: Naming conventions for interfaces/hooks/components.
- `.codex/prompts/plan-feature.md:13` - Why: Planning principle; no code during planning phase.
- `.codex/prompts/plan-feature.md:377` - Why: Required output location format for plans.
- `.codex/prompts/commands/init-project.md:5` - Why: Existing startup workflow expectations for backend/frontend.
- `.codex/prompts/prime.md:13` - Why: Prime workflow expectations for structure/docs/state checks.
- `ui-images/*` - Why: Primary visual specification for layout, spacing, typography, component hierarchy, and styling decisions for the client UI.

### New Files to Create

- `nx.json`
- `package.json`
- `tsconfig.base.json`
- `apps/server/*` (NestJS API app)
- `apps/client/*` (React + Vite app)
- `libs/shared-types/src/lib/contracts.ts`
- `libs/shared-types/src/index.ts`
- `services/understat/app/main.py`
- `services/understat/app/schemas.py`
- `services/understat/app/understat_client.py`
- `services/understat/requirements.txt`
- `services/understat/tests/test_routes.py`
- `apps/server/src/config/env.validation.ts`
- `apps/server/src/modules/data-adapter/interfaces/football-adapter.interface.ts`
- `apps/server/src/modules/data-adapter/adapters/understat.adapter.ts`
- `apps/server/src/modules/teams/teams.controller.ts`
- `apps/server/src/modules/matches/matches.controller.ts`
- `apps/server/src/modules/shot-map/shot-map.controller.ts`
- `apps/server/src/modules/http/understat-http.client.ts`
- `apps/client/src/components/pitch/FootballPitch.tsx`
- `apps/client/src/components/shot-map/ShotMapView.tsx`
- `apps/client/src/components/query/QueryPanel.tsx`
- `apps/client/src/hooks/useShotMap.ts`
- `apps/client/src/api/client.ts`
- `apps/client/src/api/football.ts`
- `apps/client/src/types/dashboard.ts`
- `apps/client/src/pages/DashboardPage.tsx`
- `ui-images/.gitkeep` (optional, only if folder is empty and must be tracked before assets are added)

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Nx: Add Nx to an Existing Project](https://nx.dev/docs/guides/adopting-nx/adding-to-existing-project)
  - Specific section: initialization path for existing repos.
  - Why: This repo already has tracked files and cannot assume empty-workspace bootstrap.
- [Nx React Plugin Overview](https://nx.dev/technologies/react/introduction)
  - Specific section: app generation and React project defaults in Nx.
  - Why: Ensures consistent Nx-native React setup.
- [NestJS Controllers](https://docs.nestjs.com/controllers)
  - Specific section: route/controller patterns.
  - Why: Defines API module/controller structure for teams/matches/shot-map endpoints.
- [NestJS Providers](https://docs.nestjs.com/providers)
  - Specific section: dependency injection/service wiring.
  - Why: Required for adapter + HTTP client layering.
- [Vite Guide](https://vite.dev/guide/)
  - Specific section: project structure and dev/build commands.
  - Why: Ensures client app and environment wiring are correct.
- [Vite Getting Started](https://vite.dev/guide/#getting-started)
  - Specific section: runtime requirements (`Node.js` support policy).
  - Why: Prevents local setup failures from unsupported Node versions.
- [React: Start a New React Project](https://react.dev/learn/start-a-new-react-project)
  - Specific section: framework/tooling guidance.
  - Why: Confirms modern React project conventions.
- [FastAPI First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
  - Specific section: app bootstrapping and path operations.
  - Why: Base for Python microservice endpoints and typing.
- [understat Python client README](https://github.com/amosbastian/understat/blob/master/README.md)
  - Specific section: async client usage and available fetch methods.
  - Why: Required for correct API calls and async context management.
- [TanStack Query React Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start)
  - Specific section: query client + hooks for server state.
  - Why: Robust client data loading/caching/error states.

### Patterns to Follow

**Naming Conventions:**
- Mirror PRD conventions: interfaces prefixed `I` in server domain contracts (`IFootballAdapter`).
- Frontend components use PascalCase (`FootballPitch`, `ShotMapView`).
- Hooks use `use*` prefix (`useShotMap`).
- Constants use `UPPER_SNAKE_CASE`.

**Error Handling:**
- Server: map upstream Python service failures into consistent HTTP exceptions (`BadGatewayException`, `RequestTimeoutException`) with structured payloads.
- Python: return explicit `HTTPException` with clear status/message for upstream fetch failures.
- Client: explicit loading/error/empty UI states; never silently fail.

**Logging Pattern:**
- Server: use NestJS `Logger` per module/service with context prefix.
- Python: use stdlib `logging` with module-level logger names.
- Avoid noisy per-record logs; aggregate counts/IDs only.

**Other Relevant Patterns:**
- Adapter boundary is mandatory: controllers must never call Python service directly.
- Normalize data once in adapter/service layer; keep UI rendering code display-focused.
- Keep query interpretation deterministic (keyword mapping), not probabilistic NLP in this slice.
- UI implementation must treat `ui-images/` as source-of-truth visual spec; if implementation diverges, document each divergence and rationale in PR notes.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Establish deterministic workspace/tooling and shared domain contracts.

**Tasks:**

- Initialize Nx in existing repo
- Generate server/client projects and shared types library
- Define baseline env/config and local run scripts
- Add Python service skeleton with dependency management

### Phase 2: Core Implementation

Implement Understat data retrieval, adapter translation, and API endpoints.

**Tasks:**

- Implement Python Understat client + route handlers (`teams`, `matches`, `shots`)
- Implement server Understat HTTP client
- Implement `IFootballAdapter` and concrete `UnderstatAdapter`
- Expose API endpoints for teams/matches/shot-map

### Phase 3: Integration

Connect UI to real backend contracts and provide first tactical visualization.

**Tasks:**

- Build pitch + shot overlay components
- Build filters (team/match) and query panel
- Wire React Query hooks to server endpoints
- Implement visual styling and layout to match `ui-images/` references
- Validate end-to-end flow from UI to Understat and back

### Phase 4: Testing & Validation

Lock behavior with unit/integration tests and smoke checks.

**Tasks:**

- Add Python route tests (success and failure)
- Add NestJS adapter/controller tests
- Add client component/hook tests
- Add command-level validations for lint/type/test/build/smoke

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE workspace foundation (`/`)

- **IMPLEMENT**: Initialize Nx on existing repository, install Nx plugins for NestJS/React/JS libs, and generate base config files.
- **PATTERN**: Existing-repo bootstrap intent from `PRD.md:780` and init workflow expectations from `.codex/prompts/commands/init-project.md:5`.
- **IMPORTS**: `@nx/workspace`, `@nx/nest`, `@nx/react`, `@nx/js`.
- **GOTCHA**: Use non-interactive flags; avoid commands requiring empty directory.
- **VALIDATE**: `npx nx@latest init --interactive=false`

### CREATE backend app (`apps/server`)

- **IMPLEMENT**: Generate NestJS app with modular structure (`modules/data-adapter`, `modules/teams`, `modules/matches`, `modules/shot-map`).
- **PATTERN**: Controller/provider pattern from Nest docs and architecture requirement in `PRD.md:11`.
- **IMPORTS**: `@nestjs/common`, `@nestjs/core`, `@nestjs/config`, `axios` (or Nest `HttpModule`).
- **GOTCHA**: Keep adapter/module boundaries; do not embed Understat-specific logic in controllers.
- **VALIDATE**: `npx nx g @nx/nest:app apps-server --directory=apps --unitTestRunner=jest --e2eTestRunner=jest --no-interactive`

### CREATE frontend app (`apps/client`)

- **IMPLEMENT**: Generate React app with Vite and set up routing for dashboard page.
- **PATTERN**: Vite and React modern setup from official docs.
- **IMPORTS**: `react`, `react-dom`, `@tanstack/react-query`.
- **GOTCHA**: Ensure Vite env prefix (`VITE_`) for client-exposed vars.
- **VALIDATE**: `npx nx g @nx/react:app apps-client --directory=apps --bundler=vite --unitTestRunner=vitest --no-interactive`

### CREATE shared contracts library (`libs/shared-types`)

- **IMPLEMENT**: Define typed contracts for `ITeam`, `IMatch`, `IShot`, `ShotMapResponse`, and query filter DTO types.
- **PATTERN**: Interface contracts from `PRD.md:566` and naming rules from `PRD.md:1038`.
- **IMPORTS**: TypeScript only (no runtime dependencies).
- **GOTCHA**: Keep normalized field shapes stable across services.
- **VALIDATE**: `npx nx g @nx/js:lib shared-types --directory=libs --bundler=tsc --unitTestRunner=jest --no-interactive`

### CREATE Python Understat service (`services/understat`)

- **IMPLEMENT**: Add FastAPI app with async Understat client wrapper and endpoints:
  - `GET /health`
  - `GET /teams?league=&season=`
  - `GET /matches?league=&season=`
  - `GET /shots?matchId=`
- **PATTERN**: Understat async usage from README and no-mock-data policy at `PRD.md:1030`.
- **IMPORTS**: `fastapi`, `uvicorn`, `understat`, `aiohttp`, `pydantic`.
- **GOTCHA**: Understat client is async and requires proper `aiohttp.ClientSession` lifecycle management.
- **VALIDATE**: `python -m pytest services/understat/tests -q`

### ADD NestJS Understat HTTP client (`apps/server/src/modules/http/understat-http.client.ts`)

- **IMPLEMENT**: Encapsulate all HTTP calls to Python service with timeout + retry policy and typed response mapping.
- **PATTERN**: Provider injection from Nest docs.
- **IMPORTS**: `@nestjs/common`, `@nestjs/axios` or `axios`.
- **GOTCHA**: Propagate upstream status codes safely; sanitize error payloads.
- **VALIDATE**: `npx nx test apps-server --testPathPattern=understat-http.client`

### ADD adapter interface + implementation (`apps/server/src/modules/data-adapter/*`)

- **IMPLEMENT**: Define `IFootballAdapter` and implement `UnderstatAdapter` methods used in slice (`getTeams`, `getMatches`, `getShotMap`).
- **PATTERN**: `PRD.md:11`, `PRD.md:81`, `PRD.md:566`.
- **IMPORTS**: shared types library + Understat HTTP client.
- **GOTCHA**: Keep provider-specific field names isolated in adapter.
- **VALIDATE**: `npx nx test apps-server --testPathPattern=understat.adapter`

### ADD API controllers (`apps/server/src/modules/{teams,matches,shot-map}`)

- **IMPLEMENT**: Expose REST endpoints:
  - `GET /api/teams`
  - `GET /api/matches`
  - `GET /api/shot-map`
  Validate query params and return normalized contracts.
- **PATTERN**: NestJS controller pattern + route shape aligned to MVP purpose.
- **IMPORTS**: DTO classes + adapter provider.
- **GOTCHA**: Guard against missing required params for shot map query.
- **VALIDATE**: `npx nx test apps-server --testPathPattern=controller`

### ADD client API layer and hooks (`apps/client/src/api/*`, `apps/client/src/hooks/useShotMap.ts`)

- **IMPLEMENT**: Configure HTTP client with `VITE_API_URL` and React Query hooks for teams, matches, shot-map.
- **PATTERN**: Query client pattern from TanStack docs and hook naming from `PRD.md:1038`.
- **IMPORTS**: `@tanstack/react-query`, HTTP client.
- **GOTCHA**: Use stable query keys including all filters.
- **VALIDATE**: `npx nx test apps-client --testPathPattern=useShotMap`

### ADD UI reference consumption (`ui-images/*` + `apps/client/src/components/*`)

- **IMPLEMENT**: Read all files under `ui-images/` and map each screen/state to concrete client components before final UI coding.
- **PATTERN**: `ui-images/` is the authoritative visual design input for this feature.
- **IMPORTS**: N/A (design input task).
- **GOTCHA**: Do not improvise layout/style direction when a reference image exists; prefer faithful implementation.
- **VALIDATE**: `rg --files ui-images`

### CREATE shot map UI (`apps/client/src/components/pitch/*`, `apps/client/src/components/shot-map/*`)

- **IMPLEMENT**: Render football pitch and shot markers sized by xG and colored by outcome/team; include legend and empty state; align structure and styling with `ui-images/`.
- **PATTERN**: Visual intelligence principle from PRD executive sections.
- **IMPORTS**: React components + shared types.
- **GOTCHA**: Normalize coordinate system once; document assumptions (0-100 or provider-native).
- **VALIDATE**: `npx nx test apps-client --testPathPattern=ShotMapView`

### ADD minimal query panel (`apps/client/src/components/query/QueryPanel.tsx`)

- **IMPLEMENT**: Add keyword/button mapping that routes to shot-map view and pre-fills filters.
- **PATTERN**: Query abstraction intent from `PRD.md` query object sections.
- **IMPORTS**: React state hooks and query dispatch utility.
- **GOTCHA**: Deterministic mapping only; do not introduce external LLM/NLP dependencies in this slice.
- **VALIDATE**: `npx nx test apps-client --testPathPattern=QueryPanel`

### UPDATE run orchestration and docs (`README.md`)

- **IMPLEMENT**: Document local startup for three processes (Python service, NestJS server, React client) and required env vars.
- **PATTERN**: Startup flow from `.codex/prompts/commands/init-project.md:5`.
- **IMPORTS**: npm scripts and simple process runner if needed.
- **GOTCHA**: Keep commands non-interactive and explicit per service.
- **VALIDATE**: `npx nx run-many -t build --projects=apps-server,apps-client,libs-shared-types`

### ADD end-to-end smoke validation (`apps/client` + `apps/server` + `services/understat`)

- **IMPLEMENT**: Add smoke script that verifies:
  - Python service health
  - server-to-python adapter connectivity
  - client can fetch and render non-empty shot map
- **PATTERN**: Validation-first workflow in `.codex/prompts/commands/validation/*`.
- **IMPORTS**: shell script or Node script plus HTTP calls.
- **GOTCHA**: Use deterministic league/season fixture inputs for repeatable results.
- **VALIDATE**: `npm run validate:smoke`

---

## TESTING STRATEGY

### Unit Tests

- Python:
  - Understat client wrapper with mocked Understat calls.
  - Route-level tests for parameter validation and response shape.
- Server:
  - Adapter mapping tests (raw Understat -> normalized contract).
  - Controller tests for query parsing and error responses.
- Client:
  - Query hooks (loading/error/data transitions).
  - Shot map rendering logic (marker count, coordinate transform, legend).
  - Query panel keyword mapping behavior.

### Integration Tests

- Server integration test with mocked Python service:
  - `/api/teams`, `/api/matches`, `/api/shot-map` contract verification.
- Full stack smoke:
  - live Python service + live server + live client fetch path.

### Edge Cases

- Python service timeout/unreachable from server.
- Understat returns empty datasets for league/season.
- Invalid `matchId` for `/shots`.
- Coordinate values missing or out of expected range.
- Client receives malformed payload (defensive parsing fallback).

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

- `npx nx format:check`
- `npx nx run-many -t lint --all`
- `npx nx run-many -t typecheck --all`
- `python -m compileall services/understat/app`

### Level 2: Unit Tests

- `npx nx test apps-server`
- `npx nx test apps-client`
- `npx nx test libs-shared-types`
- `python -m pytest services/understat/tests -q`

### Level 3: Integration Tests

- `npx nx run apps-server-e2e:test`
- `npx nx run apps-client-e2e:test` (if generated)
- `npm run test:integration:adapter`

### Level 4: Manual Validation

- Start Python service: `uvicorn services.understat.app.main:app --reload --port 8001`
- Start NestJS: `npx nx serve apps-server`
- Start React: `npx nx serve apps-client`
- Verify:
  - `GET http://localhost:8001/health`
  - `GET http://localhost:3000/api/teams`
  - Select team + match in UI and confirm shot markers render on pitch.
  - Compare implemented UI against each reference in `ui-images/` and confirm visual parity (layout, spacing, typography, states).

### Level 5: Additional Validation (Optional)

- `npx nx graph --file=tmp/dep-graph.html` (check boundaries/dependencies)
- Playwright smoke test for dashboard load and marker visibility.

---

## ACCEPTANCE CRITERIA

- [ ] Repository contains runnable Nx workspace with server/client/shared-types projects.
- [ ] Python Understat microservice is implemented and returns real data.
- [ ] NestJS exposes `/api/teams`, `/api/matches`, `/api/shot-map` through adapter abstraction.
- [ ] React dashboard renders a Shot Map from live backend data.
- [ ] Minimal query UI routes to shot-map view deterministically.
- [ ] Implemented UI matches references in `ui-images/` (or documented, justified deviations).
- [ ] All validation commands pass with zero errors.
- [ ] Unit test coverage is at least 80% for new modules.
- [ ] Integration tests verify server<->python<->client workflow.
- [ ] Code follows PRD conventions and adapter boundary rules.
- [ ] README run instructions are updated and accurate.

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes (unit + integration)
- [ ] No linting or type checking errors
- [ ] Manual testing confirms feature works
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability

---

## NOTES

- Feature name was inferred from current conversation ("build first slice") because the provided feature field was empty.
- This plan intentionally defers authentication and advanced NLP to reduce risk and maximize architecture validation speed.
- Key risk: Nx generator names/options may vary by version; run `npx nx list` and adjust command flags before execution while preserving task intent.
- Key risk: Understat data availability can vary by league/season; use deterministic fallback fixtures for smoke tests.
- Key risk: Windows/Powershell path handling for Python module imports; prefer explicit module paths and `python -m` execution style.
