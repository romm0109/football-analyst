# Feature: Authentication (Google OAuth)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Implement MVP authentication so users can sign in with Google, persist a secure server-side session across refresh, access protected routes, and sign out with explicit session invalidation.

This is the first P0 feature and unlocks all other protected backend/frontend workflows.

## User Story

As a football analyst
I want to sign in with my Google account and stay authenticated across page refreshes
So that I can securely access analysis features without repeated login friction.

## Problem Statement

The project defines authentication requirements and API contracts in product docs, but there is currently no application code checked out in this workspace. Without a concrete auth implementation plan, downstream features cannot enforce access control and session identity.

## Solution Statement

Implement OAuth authorization-code flow with Google on the backend (NestJS + Passport strategy), persist user + session records in PostgreSQL, expose `/auth` endpoints (`start`, `callback`, `me`, `logout`), and add frontend auth guard + session-aware UX.

Use secure, HTTP-only cookies and server-side session storage (not memory store) so session revocation is reliable and production-safe.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: Backend auth module, persistence layer, frontend route guards/session state, environment config  
**Dependencies**: Google OAuth 2.0, NestJS Passport integration, express-session, PostgreSQL session store (`connect-pg-simple`), React router guard pattern

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `FEATURE_BREAKDOWN.md:33` - Why: Canonical feature definition (`F01`) and required behavior.
- `FEATURE_BREAKDOWN.md:52` - Why: Required `/api/v1/auth/*` endpoint contract.
- `FEATURE_BREAKDOWN.md:58` - Why: Required `users` and `sessions` data model fields.
- `FEATURE_BREAKDOWN.md:62` - Why: Acceptance criteria (latency, protected access, logout invalidation).
- `FEATURE_BREAKDOWN.md:67` - Why: Required unit/integration/E2E testing scope.
- `PRD.md:56` - Why: Google OAuth is explicitly in MVP scope.
- `PRD.md:107` - Why: Backend API owns auth/session responsibilities.
- `PRD.md:112` - Why: Target directory structure (`apps/web`, `apps/api`, `libs/*`).
- `PRD.md:177` - Why: Runtime constraints (Node.js 20 LTS, NestJS 10+).
- `PRD.md:195` - Why: Security baseline (secure cookie strategy, HTTPS).
- `PRD.md:201` - Why: Required environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.).
- `PRD.md:278` - Why: Functional requirement: user can authenticate and start analysis session.
- `PRD.md:297` - Why: Phase ordering confirms auth belongs in foundation phase.

### New Files to Create

- `apps/api/src/modules/auth/auth.module.ts` - Auth module wiring.
- `apps/api/src/modules/auth/auth.controller.ts` - Auth endpoints.
- `apps/api/src/modules/auth/auth.service.ts` - Session/user auth orchestration.
- `apps/api/src/modules/auth/strategies/google.strategy.ts` - Passport Google strategy.
- `apps/api/src/modules/auth/guards/authenticated.guard.ts` - Guard for protected endpoints.
- `apps/api/src/modules/auth/decorators/current-user.decorator.ts` - Request user extraction helper.
- `apps/api/src/modules/users/users.module.ts` - User persistence module.
- `apps/api/src/modules/users/users.service.ts` - User upsert/find methods.
- `apps/api/src/modules/users/users.repository.ts` - DB repository abstraction.
- `apps/api/src/modules/sessions/sessions.repository.ts` - Session persistence and revocation access.
- `apps/api/src/config/auth.config.ts` - Auth/session typed config.
- `apps/api/src/main.ts` (if absent) - Middleware setup (`express-session`, passport, trust proxy policy).
- `apps/api/src/database/migrations/<timestamp>_create_users_sessions.sql` - Schema migration.
- `apps/web/src/features/auth/auth-api.ts` - `/auth/me` and logout client calls.
- `apps/web/src/features/auth/auth-store.ts` - Client auth/session state.
- `apps/web/src/features/auth/AuthGate.tsx` - Route guard component.
- `apps/web/src/features/auth/LoginPage.tsx` - Google sign-in entry page.
- `apps/web/src/features/auth/useRequireAuth.ts` - Guarding hook.
- `apps/web/src/app/router.tsx` - Protected/public route wiring.
- `apps/web/src/types/auth.ts` - Typed auth payload contracts.
- `apps/api/test/integration/auth.integration.spec.ts` - Backend integration tests.
- `apps/web/src/features/auth/__tests__/auth-gate.test.tsx` - Frontend guard tests.
- `apps/web-e2e/src/auth.e2e.spec.ts` - Login/logout E2E flow.

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [NestJS Passport recipe](https://docs.nestjs.com/recipes/passport)
  - Specific section: strategy + guard integration.
  - Why: Defines canonical Nest auth wiring with Passport.
- [NestJS Session technique](https://docs.nestjs.com/techniques/session)
  - Specific section: Express middleware setup, `secure: true`, proxy note.
  - Why: Required for server-side session cookie setup.
- [Google OAuth 2.0 for Web Server Apps](https://developers.google.com/identity/protocols/oauth2/web-server#redirect_uri_validation_rules)
  - Specific section: redirect URI validation and `state` usage.
  - Why: Prevent callback mismatch and CSRF vulnerabilities.
- [passport-google-oauth20 package](https://www.passportjs.org/packages/passport-google-oauth20/)
  - Specific section: strategy options + verify callback inputs.
  - Why: Strategy contract for profile mapping.
- [express-session README](https://github.com/expressjs/session)
  - Specific section: MemoryStore warning and cookie defaults.
  - Why: Must avoid in-memory store in production.
- [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple)
  - Specific section: PostgreSQL-backed session store + table creation.
  - Why: Session durability and horizontal scaling readiness.
- [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
  - Specific section: `SameSite`, `Secure`, `HttpOnly` interplay.
  - Why: Correct cookie security flags for auth.
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
  - Specific section: secure cookie/session lifecycle controls.
  - Why: Security hardening baseline.
- [OWASP OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
  - Specific section: CSRF mitigation via `state`.
  - Why: Avoid OAuth callback tampering.
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
  - Specific section: supported/LTS policy.
  - Why: Keep runtime on supported LTS lines.

### Patterns to Follow

Because no application source code is currently present in the working tree, patterns are inferred from `FEATURE_BREAKDOWN.md` and `PRD.md` and must be treated as mandatory starter conventions.

**Naming Conventions:**
- Use Nest module-based structure: `modules/auth`, `modules/users`, `modules/sessions` (from `PRD.md:120`).
- API namespace `/api/v1/*` (from `FEATURE_BREAKDOWN.md:53`).
- Types/interfaces in shared lib when duplicated across backend/frontend.

**Error Handling:**
- Invalid/expired session returns `401` consistently.
- OAuth callback failures should redirect to login page with deterministic error code (`oauth_failed`, `state_mismatch`, `session_expired`).
- Avoid exposing provider internals in error responses.

**Logging Pattern:**
- Structured logs around auth lifecycle events: `login_start`, `login_success`, `login_failure`, `logout`, `session_revoked`.
- Never log tokens, session IDs, or client secrets.

**Other Relevant Patterns:**
- Required API shape from feature doc:
```text
GET /api/v1/auth/google/start
GET /api/v1/auth/google/callback
POST /api/v1/auth/logout
GET /api/v1/auth/me
```
- Required data model shape from feature doc:
```text
users(id, google_sub, email, name, created_at, updated_at)
sessions(id, user_id, expires_at, created_at, revoked_at)
```
- Provider abstraction direction from PRD should be preserved so auth provider can evolve later.

### Anti-Patterns to Avoid

- Using `MemoryStore` for sessions in any non-local environment.
- Storing raw OAuth tokens in frontend-accessible storage.
- Skipping `state` validation in OAuth callback.
- Returning protected resource payloads before auth guard checks.
- Using wildcard redirect URIs in Google client configuration.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Establish runtime-safe auth foundation and persistent storage.

**Tasks:**

- Scaffold backend/frontend app skeleton if missing (`apps/api`, `apps/web`, `libs/shared-types`).
- Add auth/session dependencies and typed config management.
- Create `users` + `sessions` schema migration and repositories.
- Configure `express-session` + PostgreSQL store + passport initialization.

### Phase 2: Core Implementation

Implement Google OAuth flow and session lifecycle.

**Tasks:**

- Implement Google Passport strategy and auth module.
- Implement `/auth/google/start` and `/auth/google/callback`.
- Upsert user on successful callback and issue persisted session.
- Implement `/auth/me` and `/auth/logout` with revocation semantics.

### Phase 3: Integration

Integrate auth state into protected app experience.

**Tasks:**

- Add frontend login page and auth bootstrap (`/auth/me` on app load).
- Add route guard for protected routes and redirect unauthenticated users.
- Add session-expiry handling UX and logout flow.
- Apply auth guard to existing protected backend routes.

### Phase 4: Testing & Validation

Lock behavior with tests at unit, integration, and E2E layers.

**Tasks:**

- Unit tests for session service, state validator, and repositories.
- Integration tests for callback success/failure and `/auth/me` semantics.
- E2E flow: login -> protected app access -> logout -> access denied.

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE `apps/api` and `apps/web` workspace skeleton (only if missing)

- **IMPLEMENT**: Bootstrap monorepo/apps structure aligned to `PRD.md:112` before auth implementation.
- **PATTERN**: `PRD.md:112` directory map.
- **IMPORTS**: Nx/Nest/React toolchain selected by project baseline.
- **GOTCHA**: Keep paths exactly `apps/api` and `apps/web` to match PRD references.
- **VALIDATE**: `rg --files apps`

### CREATE backend auth dependencies and config registration

- **IMPLEMENT**: Add backend deps: `@nestjs/passport`, `passport`, `passport-google-oauth20`, `express-session`, `connect-pg-simple` and register typed env config for Google/session vars.
- **PATTERN**: Nest Passport integration (`docs.nestjs.com/recipes/passport`).
- **IMPORTS**: `ConfigModule`, `PassportModule`, session store adapter.
- **GOTCHA**: Prefer package versions compatible with chosen Nest major (verify lockfile).
- **VALIDATE**: `npm run lint -- apps/api` (or project-equivalent lint command)

### CREATE migration `users` and `sessions` schema

- **IMPLEMENT**: Create DB migration with constraints/indexes:
  - `users.google_sub` unique
  - `sessions.user_id` FK -> `users.id`
  - index on `sessions.expires_at` and `sessions.revoked_at`
- **PATTERN**: Required model fields from `FEATURE_BREAKDOWN.md:58`.
- **IMPORTS**: Migration framework used by project (Prisma/TypeORM/Knex/SQL).
- **GOTCHA**: Store session ID hash or opaque ID strategy; avoid predictable IDs.
- **VALIDATE**: `<migration-command> --check` (project-specific non-interactive migration validation)

### CREATE session middleware setup in `apps/api/src/main.ts`

- **IMPLEMENT**: Configure `express-session` with PostgreSQL store, secure cookie flags, proxy trust for HTTPS terminations, and sane TTL.
- **PATTERN**: Nest session setup (`docs.nestjs.com/techniques/session`), `MemoryStore` avoidance (`github.com/expressjs/session`).
- **IMPORTS**: `express-session`, `connect-pg-simple`.
- **GOTCHA**: `secure: true` requires HTTPS/proxy config; ensure environment switch for local dev.
- **VALIDATE**: `npm run test -- apps/api -- auth-session-config`

### CREATE Google strategy `apps/api/src/modules/auth/strategies/google.strategy.ts`

- **IMPLEMENT**: Implement Passport strategy with callback URL, scopes (`openid profile email`), and strict `state` validation token.
- **PATTERN**: Google OAuth web-server flow + `state` CSRF protection.
- **IMPORTS**: `PassportStrategy`, `Strategy` from `passport-google-oauth20`.
- **GOTCHA**: Callback URI must exactly match Google console config.
- **VALIDATE**: `npm run test -- apps/api -- google.strategy`

### CREATE auth controller/service endpoints

- **IMPLEMENT**:
  - `GET /api/v1/auth/google/start`: begin OAuth redirect
  - `GET /api/v1/auth/google/callback`: finalize auth, persist session, redirect to web
  - `GET /api/v1/auth/me`: return current user/session
  - `POST /api/v1/auth/logout`: revoke session + clear cookie
- **PATTERN**: Endpoint contract in `FEATURE_BREAKDOWN.md:52`.
- **IMPORTS**: guards, session/user services, DTOs.
- **GOTCHA**: Logout must invalidate server-side session, not just clear cookie.
- **VALIDATE**: `npm run test -- apps/api -- auth.controller`

### CREATE authenticated guard and current-user decorator

- **IMPLEMENT**: Centralize auth checks for protected routes and typed request user extraction.
- **PATTERN**: Guard-based route protection in Nest.
- **IMPORTS**: `CanActivate`, `ExecutionContext`, request typing.
- **GOTCHA**: Guard should fail closed (unauthenticated by default).
- **VALIDATE**: `npm run test -- apps/api -- authenticated.guard`

### CREATE frontend auth API/store/guard components

- **IMPLEMENT**: Add auth bootstrap (`/auth/me`), login page with Google redirect trigger, guarded app shell, logout action, and session-expiry redirect.
- **PATTERN**: `FEATURE_BREAKDOWN.md:47` frontend auth scope.
- **IMPORTS**: Router, fetch client, state store (project standard).
- **GOTCHA**: Avoid localStorage tokens for session auth model.
- **VALIDATE**: `npm run test -- apps/web -- auth-gate`

### UPDATE backend route protection integration

- **IMPLEMENT**: Apply auth guard globally or at controller-level to all non-public endpoints.
- **PATTERN**: Security requirement `PRD.md:211` (authenticated access).
- **IMPORTS**: global guard registration or per-controller decorators.
- **GOTCHA**: Keep `/auth/google/start` and `/auth/google/callback` public.
- **VALIDATE**: `npm run test -- apps/api -- protected-routes`

### CREATE integration tests for auth flow

- **IMPLEMENT**: Backend integration tests for callback success/failure, `state` mismatch, `/auth/me`, logout revocation.
- **PATTERN**: `FEATURE_BREAKDOWN.md:67` integration requirements.
- **IMPORTS**: Supertest + Nest testing module.
- **GOTCHA**: Stub Google profile exchange; do not hit external Google in CI.
- **VALIDATE**: `npm run test:integration -- apps/api -- auth`

### CREATE E2E auth journey tests

- **IMPLEMENT**: E2E scenario: unauthenticated route redirect -> login success simulation -> protected route access -> logout -> blocked access.
- **PATTERN**: `FEATURE_BREAKDOWN.md:70` E2E requirement.
- **IMPORTS**: Existing e2e framework (Playwright/Cypress/Nx e2e).
- **GOTCHA**: Use deterministic mock OAuth callback route for CI reliability.
- **VALIDATE**: `npm run e2e -- apps/web-e2e -- auth`

### UPDATE docs/config examples

- **IMPLEMENT**: Document required env vars, Google console redirect URI setup, and local HTTPS/proxy requirements.
- **PATTERN**: PRD configuration section (`PRD.md:201`).
- **IMPORTS**: README/docs paths used by repo.
- **GOTCHA**: Never commit secrets; include `.env.example` only.
- **VALIDATE**: `rg "GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|SESSION_SECRET" -n README* docs*`

---

## TESTING STRATEGY

### Unit Tests

- Auth service:
  - user upsert behavior (`new user`, `existing user`)
  - session issuance (`expiry`, `revoked_at = null`)
  - session revocation on logout
- Google strategy:
  - profile-to-user mapping
  - missing email/sub handling
  - state mismatch rejection
- Guard/decorator:
  - authenticated and unauthenticated request handling

### Integration Tests

- `GET /auth/google/callback` success path creates user + session and returns redirect.
- `GET /auth/google/callback` invalid state returns auth failure.
- `GET /auth/me` returns user when session valid, `401` when revoked/expired.
- `POST /auth/logout` revokes session and clears cookie.

### Edge Cases

- User denies consent at Google screen.
- Callback with missing profile fields.
- Replay of old callback `state`.
- Expired session cookie + still-present DB row.
- Multiple active sessions for same user (decide policy: allow/revoke-others).
- Clock skew affecting `expires_at` checks.

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

- `npm run lint`
- `npm run typecheck`
- `npm run format:check`

### Level 2: Unit Tests

- `npm run test -- apps/api`
- `npm run test -- apps/web`

### Level 3: Integration Tests

- `npm run test:integration -- apps/api -- auth`
- `npm run e2e -- apps/web-e2e -- auth`

### Level 4: Manual Validation

- Configure Google OAuth client with callback URI exactly matching backend callback endpoint.
- Visit login page and start OAuth flow.
- Confirm post-login redirect reaches protected route.
- Refresh browser; confirm session persists (`/auth/me` still valid).
- Execute logout; confirm subsequent `/auth/me` returns `401`.
- Attempt direct access to protected route while logged out; confirm redirect to login.

### Level 5: Additional Validation (Optional)

- Security checks:
  - Verify cookie flags in browser/network (`HttpOnly`, `Secure`, `SameSite`).
  - Verify no auth token/session ID leakage in logs.
- Load test login endpoint for p95 under required threshold.

---

## ACCEPTANCE CRITERIA

- [ ] `F01` feature behavior from `FEATURE_BREAKDOWN.md` is fully implemented.
- [ ] `/api/v1/auth/google/start`, `/callback`, `/logout`, `/me` are implemented and tested.
- [ ] Unauthorized users cannot access protected routes.
- [ ] Session persists across refresh and expires/revokes correctly.
- [ ] Logout invalidates active session server-side.
- [ ] Login success path is under 5 seconds under normal staging conditions.
- [ ] Unit + integration + E2E tests pass for auth flows.
- [ ] Cookie and OAuth security controls meet baseline (`state`, secure flags, no MemoryStore).
- [ ] Documentation/env setup updated for reproducible local/staging config.

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

- Workspace status note: this repository currently has documentation files present, with most previously tracked source files deleted in the working tree. This plan therefore specifies target file creation paths rather than patching existing source files.
- Implementation decision: use server-side sessions (not JWT-only) to satisfy explicit `sessions` table requirement and deterministic logout invalidation.
- Security decisions:
  - OAuth `state` token is mandatory.
  - session cookie should be `HttpOnly`, `Secure` (outside local), and explicit `SameSite` policy.
  - server-side session store should be PostgreSQL-backed.
- Version note (as of February 19, 2026): Node v20 is in Maintenance LTS; Node v24 is Active LTS. Keep runtime policy explicit and align dependency majors with the selected Nest version.
- Confidence for one-pass implementation success: **8.5/10** (reduced from 10 due to absent checked-out app code and unknown chosen ORM/router tooling).
