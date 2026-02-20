# Agent 1 PRD Audit Changelog

## Scope

Compared the current codebase against `PRD.md`, implemented high-impact missing MVP requirements in the query/insight pipeline, and validated the workspace with relevant checks.

## Completed in this pass

- Implemented a hybrid parsing flow in `apps/api/src/modules/query/parse.service.ts`:
  - Added rule-based intent extraction path.
  - Added heuristic LLM-like intent inference path.
  - Added deterministic reconciliation so dictionary rules stay authoritative while inferred phase/minute hints can fill gaps.
- Updated dashboard widget generation in `apps/api/src/modules/query/insight.service.ts` to include all PRD chart families in defaults:
  - `pitch_zones`
  - `pass_network`
  - `xg_timeline`
  - `pressure_map`

## PRD requirement status snapshot

### Implemented or largely covered

- Google-auth session-oriented auth module structure exists (start/callback/me/logout endpoints and session model).
- Team/opponent context exists with validation and default match window support.
- Clarification-first query flow exists (`clarificationRequired`, clarify endpoint path).
- Query responses include confidence, warnings, and follow-up suggestions.
- Dashboard versioning primitives exist: edit, pin/unpin, undo/redo.
- Export and feedback endpoints exist and are integrated in flow-level integration test.
- Observability metrics capture exists for query/export latency and stage timings.

### Remaining / partial gaps against PRD MVP intent

- True LLM-backed parsing and answer generation are still mocked/heuristic (no external LLM provider integration).
- StatsBomb open-data ingestion is placeholder-level (job health shape exists, full ETL + daily scheduler + idempotent upsert pipeline not implemented).
- Frontend experience is skeletal (no full chat/dashboard UI rendering pipeline, controls, or coach-ready interaction surface implemented).
- Export service returns metadata about a PDF artifact but does not generate/store a real multi-page PDF document with narrative and chart payloads.
- Security/ops hardening from PRD is only partial (HTTPS enforcement, managed secret-store integration, and richer audit logging not fully implemented).
- SLA/performance guardrails are minimally instrumented; no threshold alerting policy implementation is present.

## Validation run

- `npm run test` -> PASS
- `npm run test:integration` -> PASS
- `npm run typecheck` -> PASS
- `npm run e2e` -> PASS
