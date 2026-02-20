# Developer Feature Breakdown (MVP)

## Purpose
This document translates `PRD.md` into implementable feature modules for engineering.  
Audience: frontend, backend, data, QA.

## Conventions
- Priority: `P0` (must-have for MVP), `P1` (should-have), `P2` (nice-to-have if time permits).
- Status: `Not Started`, `In Progress`, `Done`, `Blocked`.
- Definition of done (DoD) per feature includes API, UI, tests, and observability.

## MVP Features Overview
| ID | Feature | Priority | Owner |
|---|---|---|---|
| F01 | Authentication (Google OAuth) | P0 | Backend + Frontend |
| F02 | Team/Opponent Selection + Session Context | P0 | Frontend + Backend |
| F03 | StatsBomb Open Data Ingestion (Daily Batch) | P0 | Data + Backend |
| F04 | Tactical Dictionary + Hybrid Query Parsing | P0 | Backend + Data |
| F05 | Clarification-First Query Flow | P0 | Backend + Frontend |
| F06 | Insight Generation Engine | P0 | Backend |
| F07 | Auto Dashboard Generation | P0 | Backend + Frontend |
| F08 | Conversational Dashboard Editing | P0 | Backend + Frontend |
| F09 | Direct UI Controls (Filters) | P0 | Frontend + Backend |
| F10 | Pin/Unpin Widgets + Undo/Redo Versioning | P1 | Frontend + Backend |
| F11 | Multi-Page PDF Export (Narrative + Charts) | P0 | Backend + Frontend |
| F12 | Dynamic Follow-Up Suggestions | P1 | Backend |
| F13 | Confidence & Warning Guardrails | P0 | Backend + Frontend |
| F14 | Ratings & Feedback Capture | P1 | Frontend + Backend |
| F15 | Observability, Performance, and SLA Controls | P0 | Platform + Backend |

---

## F01: Authentication (Google OAuth)
### Goal
Allow secure login/logout using Google accounts.

### Functional Requirements
- User can sign in with Google.
- Authenticated session persists across refresh.
- User can sign out cleanly.

### Technical Scope
- Backend:
  - OAuth callback endpoint.
  - Session issue/verify/refresh logic.
  - User persistence (`users` table, minimal profile).
- Frontend:
  - Login page/button.
  - Auth guard for application routes.
  - Session expiry handling UI.

### API
- `GET /api/v1/auth/google/start`
- `GET /api/v1/auth/google/callback`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Data Model
- `users(id, google_sub, email, name, created_at, updated_at)`
- `sessions(id, user_id, expires_at, created_at, revoked_at)`

### Acceptance Criteria
- Login success path < 5 seconds.
- Unauthorized users cannot access protected routes.
- Logout invalidates active session.

### Tests
- Unit: token/session service.
- Integration: auth callback and `/auth/me`.
- E2E: login -> app access -> logout.

---

## F02: Team/Opponent Selection + Session Context
### Goal
Set analysis context (my team + opponent) before querying.

### Functional Requirements
- Manual selection for team and opponent.
- Default query window: last 5 matches.
- Context visible and editable in UI.

### Technical Scope
- Frontend:
  - Selector components and context panel.
  - Persist selected context per chat session.
- Backend:
  - Validate selected entities against available dataset.
  - Attach context to query requests.

### API
- `GET /api/v1/catalog/teams`
- `GET /api/v1/catalog/competitions`
- `POST /api/v1/context`

### Acceptance Criteria
- Cannot run query without valid team/opponent.
- Context changes apply to subsequent queries only (no silent retroactive mutation).

### Tests
- Unit: context validation.
- Integration: invalid selection handling.
- E2E: select context -> run query.

---

## F03: StatsBomb Open Data Ingestion (Daily Batch)
### Goal
Ingest and normalize StatsBomb open data daily for analytics queries.

### Functional Requirements
- Scheduled daily ingestion.
- Idempotent upserts (re-runs do not duplicate).
- Track ingestion job status and errors.

### Technical Scope
- Data pipeline:
  - Fetch source files.
  - Parse matches/events.
  - Normalize into analytics schema.
  - Derive baseline aggregates.
- Backend:
  - Expose job health endpoint.

### Data Model (Core)
- `matches(match_id, competition, season, home_team, away_team, match_date, status)`
- `events(event_id, match_id, team, player, minute, second, type, x, y, end_x, end_y, outcome, raw_json)`
- `derived_team_metrics(match_id, team_id, metric_key, metric_value)`
- `ingestion_jobs(id, run_at, status, records_read, records_written, error_message)`

### Acceptance Criteria
- Daily job success rate >= 95%.
- Failed job emits alert and can be retried.
- Data available for query service by next run cycle.

### Tests
- Unit: parsers + transformers.
- Integration: end-to-end ETL test on sample dataset.
- Data quality: row counts, mandatory fields, duplicate checks.

---

## F04: Tactical Dictionary + Hybrid Query Parsing
### Goal
Interpret natural language using both LLM and analyst-defined tactical rules.

### Functional Requirements
- Extract entities: tactical concept, phase, time window, match scope.
- Map aliases/synonyms to canonical tactical terms.
- Resolve conflict between LLM output and rules deterministically.

### Technical Scope
- Tactical dictionary store:
  - Terms, aliases, definitions, priority.
- Parser pipeline:
  1. Rule-based parse.
  2. LLM parse.
  3. Reconciliation policy.
  4. Confidence scoring.

### API
- `POST /api/v1/parse`
- `GET /api/v1/tactical-dictionary`
- `PUT /api/v1/tactical-dictionary/{id}` (admin/dev use)

### Acceptance Criteria
- Parser returns structured intent object for valid query.
- Unknown/ambiguous terms trigger clarification path.

### Tests
- Unit: rule resolver and conflict merge.
- Integration: parser on real analyst phrasing set.
- Regression suite for tactical synonyms.

---

## F05: Clarification-First Query Flow
### Goal
Ask clarifying questions before execution when query ambiguity is detected.

### Functional Requirements
- Detect ambiguous intent and missing parameters.
- Return concise clarification options.
- Resume query after clarification response.

### Technical Scope
- Backend:
  - Ambiguity decision policy.
  - State machine for pending clarification.
- Frontend:
  - Render clarification chip/buttons and free-text option.

### API
- `POST /api/v1/query` returns `clarificationRequired=true`
- `POST /api/v1/query/{queryId}/clarify`

### Acceptance Criteria
- Ambiguous prompts are intercepted before data fetch.
- Clarification answers merge correctly into original query intent.

### Tests
- Unit: ambiguity thresholds.
- Integration: clarify/resume flow.
- E2E: ambiguous prompt -> clarify -> result.

---

## F06: Insight Generation Engine
### Goal
Produce tactical answer text grounded in event-derived metrics.

### Functional Requirements
- Retrieve relevant historical data.
- Compute tactical indicators.
- Generate final answer in selected audience mode (technical/simplified).

### Technical Scope
- Metrics computation modules:
  - pressing response patterns
  - xG progression
  - passing lanes/channel utilization
- Answer composer with template + LLM enrichment.

### API
- Internal service called by `POST /api/v1/query`.

### Acceptance Criteria
- Response includes tactical finding + supporting rationale.
- Median response latency <= 30s end-to-end with dashboard generation.

### Tests
- Unit: metric calculators.
- Integration: full query orchestration.
- Golden tests for output consistency on fixed inputs.

---

## F07: Auto Dashboard Generation
### Goal
Generate contextual dashboard widgets automatically with each answer.

### Functional Requirements
- Select relevant widget types from query intent.
- Bind widgets to exact fetched data.
- Render metadata: competition, season, sample size.

### Technical Scope
- Backend:
  - Widget recommendation engine.
  - Declarative dashboard spec generator.
- Frontend:
  - Dashboard renderer from JSON spec.

### Dashboard Spec (Example)
```json
{
  "dashboardId": "db_123",
  "widgets": [
    { "id": "w1", "type": "pitch_zones", "pinned": false, "filters": {} },
    { "id": "w2", "type": "pressure_map", "pinned": false, "filters": {} }
  ],
  "metadata": { "competition": "Premier League", "season": "2025/26", "sampleSize": 5 },
  "version": 1
}
```

### Acceptance Criteria
- Every successful query returns dashboard spec.
- Chart choice matches detected tactical intent in UAT.

### Tests
- Unit: widget selector rules.
- Integration: spec generation from parser output.
- UI tests: chart rendering from spec.

---

## F08: Conversational Dashboard Editing
### Goal
Update existing dashboard through follow-up prompts without losing structure.

### Functional Requirements
- Interpret edit instructions (time range, event type, phase, chart changes).
- Apply edits incrementally to current dashboard version.
- Preserve pinned widgets.

### Technical Scope
- Backend:
  - Edit-intent parser.
  - Patch generator for dashboard spec.
- Frontend:
  - Apply patch and animate rerender.

### API
- `POST /api/v1/dashboard/{dashboardId}/edit`

Request example:
```json
{
  "instruction": "Change the pitch map to only show the last 15 minutes"
}
```

### Acceptance Criteria
- Edit response updates only targeted widgets/filters.
- Original analysis context remains stable unless explicitly changed.

### Tests
- Unit: edit parser and patch generation.
- Integration: multi-edit chain.
- E2E: query -> edit -> export.

---

## F09: Direct UI Controls (Filters)
### Goal
Enable fast non-chat edits using UI controls.

### Functional Requirements
- Time range controls.
- Phase toggles.
- Competition/match subset selectors (if context permits).

### Technical Scope
- Frontend:
  - Filter toolbar + widget-local controls.
- Backend:
  - Validate control payloads and return updated datasets/spec.

### API
- `PATCH /api/v1/dashboard/{dashboardId}/filters`

### Acceptance Criteria
- Common filter change reflected on charts < 10s.
- UI controls and chat edits share same source of truth state.

### Tests
- Unit: filter schema validation.
- UI integration: controls update charts correctly.

---

## F10: Pin/Unpin Widgets + Undo/Redo Versioning
### Goal
Support safe iteration during tactical exploration.

### Functional Requirements
- Pin widgets to prevent replacement/removal.
- Track dashboard versions.
- Undo/redo stack per dashboard session.

### Technical Scope
- Backend:
  - Versioned dashboard snapshots.
- Frontend:
  - Action history and controls.

### API
- `POST /api/v1/dashboard/{dashboardId}/pin`
- `POST /api/v1/dashboard/{dashboardId}/unpin`
- `POST /api/v1/dashboard/{dashboardId}/undo`
- `POST /api/v1/dashboard/{dashboardId}/redo`

### Acceptance Criteria
- Pinned widgets remain untouched by auto-regeneration/edit ops.
- Undo reliably restores previous full dashboard state.

### Tests
- Unit: version graph and pin constraints.
- Integration: pin + edit + undo scenarios.

---

## F11: Multi-Page PDF Export (Narrative + Charts)
### Goal
Produce coach-ready report from current session outputs.

### Functional Requirements
- Export includes:
  - Narrative response
  - Current dashboard visuals
  - Metadata (competition/season/sample size)
- Multi-page layout with stable formatting.

### Technical Scope
- Backend:
  - Report assembly and render service.
  - File artifact storage/streaming.
- Frontend:
  - Export action + progress feedback.

### API
- `POST /api/v1/export/pdf`

Request example:
```json
{
  "dashboardId": "db_123",
  "queryId": "q_456",
  "includeNarrative": true
}
```

### Acceptance Criteria
- Export success rate >= 95%.
- Generated PDF opens correctly in standard readers.

### Tests
- Integration: PDF generation from known dashboard.
- Snapshot tests for template consistency.

---

## F12: Dynamic Follow-Up Suggestions
### Goal
Suggest 2-5 context-aware follow-up questions after each result.

### Functional Requirements
- Suggestion count is dynamic.
- Suggestions are tactical and data-backed.
- One-click suggestion submission in UI.

### Acceptance Criteria
- Suggestions present on all successful query responses.
- Suggestion relevance rated positively in pilot feedback.

### Tests
- Unit: suggestion policy.
- Integration: suggestion generation in query response.

---

## F13: Confidence & Warning Guardrails
### Goal
Handle low-confidence or sparse-data cases safely.

### Functional Requirements
- If confidence low: ask follow-up question first.
- If user insists: proceed with visible warning.
- Include concise reason for warning (sample size/coverage/ambiguity).

### API Contract Fields
- `confidence: high | medium | low`
- `warning: string | null`
- `requiresFollowUp: boolean`

### Acceptance Criteria
- Low-confidence responses are never returned silently.
- Warning text is explicit and actionable.

### Tests
- Unit: confidence thresholds.
- Integration: insist-after-warning flow.

---

## F14: Ratings & Feedback Capture
### Goal
Measure success via analyst and coach ratings.

### Functional Requirements
- Capture rating at end of session/report usage.
- Store optional text feedback.
- Dashboard for aggregate metrics.

### API
- `POST /api/v1/feedback/rating`
- `GET /api/v1/feedback/summary`

### Data Model
- `ratings(id, user_id, query_id, role_type, score, comment, created_at)`

### Acceptance Criteria
- Rating prompt shown in key completion moments.
- Summary metrics available for product evaluation.

### Tests
- Unit: rating validation.
- Integration: summary aggregation.

---

## F15: Observability, Performance, and SLA Controls
### Goal
Maintain reliability and enforce <30s query SLA.

### Functional Requirements
- Track query latency breakdown:
  - parse time
  - data fetch time
  - insight generation time
  - dashboard render-spec time
- Track ingestion reliability and export failures.
- Alert on SLA breaches.

### Technical Scope
- Structured logging with correlation IDs.
- Metrics dashboards (p50/p95 latency, error rate).
- Alert policies for critical failures.

### Acceptance Criteria
- SLA dashboard available to team.
- Alerts trigger on defined thresholds.

### Tests
- Load tests on representative query set.
- Chaos/failure-mode tests for job retries.

---

## Cross-Cutting Engineering Requirements
### Performance
- Query + dashboard response median <= 30s.
- Common dashboard filter edits <= 10s.

### Data Quality
- Required event fields validated during ingest.
- Sample size explicitly tracked per insight.

### UX
- Clarification-first behavior for ambiguous prompts.
- Audience mode switch (`technical`/`simplified`) available per query.

### Security
- All endpoints behind authenticated session.
- Input validation on all write/edit endpoints.
- Secrets managed via environment variables.

### Accessibility (Web)
- Keyboard-navigable chat and controls.
- Charts include text summary fallback.

---

## Suggested Sprint Breakdown
### Sprint 1-2
- F01, F02, F03 baseline.

### Sprint 3-4
- F04, F05, F06.

### Sprint 5-6
- F07, F08, F09, F13.

### Sprint 7
- F10, F11.

### Sprint 8
- F12, F14, F15 hardening + release readiness.

---

## Developer Handoff Checklist
- ✅ API contracts finalized and versioned.
- ✅ Dashboard spec schema documented.
- ✅ Tactical dictionary seed format defined.
- ✅ Data ingestion runbook written.
- ✅ Monitoring/alert baseline configured.
- ✅ QA test matrix mapped to feature IDs.
