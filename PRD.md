# Product Requirements Document (PRD)

## 1. Executive Summary
The product is a desktop web application that helps elite football analysts and head coaches turn natural-language tactical questions into evidence-backed insights and coach-ready visuals. Instead of manually querying event datasets and building charts in separate tools, users ask a question in chat and receive a tactical answer with an auto-generated dashboard.

The core value proposition is speed-to-insight with analyst-grade rigor. The system combines a hybrid query interpretation layer (LLM + analyst-defined tactical rules) with event data retrieval and context-aware visualization generation. Users can iteratively refine the same dashboard via conversational prompts and UI controls, then export a multi-page PDF containing both narrative and charts.

MVP goal: deliver a single-user tool that reliably answers opponent-focused tactical questions across the last 5 matches, produces editable visual dashboards in under 30 seconds, and is trusted enough by analysts/coaches to achieve high quality ratings and regular usage.

## 2. Mission
### Mission Statement
Enable football performance staff to move from question to tactical decision in minutes, not hours, using AI-assisted analysis grounded in event data.

### Core Principles
- Analyst-first accuracy over generic AI fluency.
- Evidence-backed outputs with clear sample context.
- Fast iteration through conversation and direct controls.
- Presentation-ready deliverables without external tooling.
- MVP focus: solve one workflow deeply before broad expansion.

## 3. Target Users
### Primary Personas
- **Elite Soccer Data Analyst (Primary):** prepares opponent reports, validates tactical hypotheses, presents findings to coaching staff.
- **Head Coach (Secondary):** consumes tactical summaries and visuals to support match planning.

### Technical Comfort
- Analysts: medium-high technical comfort with football data concepts.
- Head coaches: medium comfort; need switchable language level (technical vs simplified).

### Needs and Pain Points
- Slow manual data pulls and chart creation across tools.
- Difficulty translating data work into coach-ready visuals quickly.
- Need for rapid “what if” refinement in meetings.
- Need confidence boundaries (clarify ambiguity, warn on weak samples).

## 4. MVP Scope
### In Scope
#### Core Functionality
- ✅ Natural-language tactical query input in chat.
- ✅ Hybrid query parsing (LLM + analyst-defined tactical dictionary/rules).
- ✅ Cross-match analysis with default scope = last 5 matches.
- ✅ Clarification-first behavior for ambiguous questions.
- ✅ AI response with dynamic follow-up question suggestions (2-5).

#### Visualization & Reporting
- ✅ Auto-generated dashboard linked to each answer.
- ✅ Chart types: pitch zones, pass network, xG timeline, pressure maps.
- ✅ Conversational dashboard edits and direct UI controls.
- ✅ Widget pinning to prevent replacement.
- ✅ Undo/versioning for dashboard state changes.
- ✅ Multi-page PDF export with narrative + charts.
- ✅ Mandatory metadata on visuals: competition, season, sample size.

#### Technical & Data
- ✅ Desktop web app.
- ✅ Google login (OAuth) authentication.
- ✅ StatsBomb open data integration for MVP.
- ✅ Daily batch data updates.
- ✅ Single-user experience.

#### Deployment
- ✅ Cloud-hosted web app with secure environment configuration.

### Out of Scope
#### Core Functionality
- ❌ Multi-user collaboration, comments, shared workspaces.
- ❌ Long-term memory across chats/sessions.
- ❌ In-app manual editing of AI narrative before export.

#### Technical & Security
- ❌ Enterprise SSO (SAML/Okta), RBAC roles.
- ❌ Real-time/live match ingestion.
- ❌ White-label/club branding templates.

#### Integration & Commercial
- ❌ Paid StatsBomb API integration in MVP (planned upgrade path only).
- ❌ Billing implementation (per-club model deferred).

## 5. User Stories
1. As an elite soccer data analyst, I want to ask natural-language tactical questions about an opponent, so that I can identify weaknesses without manual event querying.  
   Example: “How do teams beat their high press in the last 5 matches?”

2. As an analyst, I want the system to generate a dashboard with my answer, so that I can immediately validate insights with visuals.  
   Example: pitch zones + pressure map appear with the text response.

3. As an analyst, I want to refine generated visuals by chat, so that I can quickly iterate during prep meetings.  
   Example: “Show only the final 15 minutes and in-possession sequences.”

4. As an analyst, I want quick UI controls for time range and phases of play, so that I can adjust outputs faster than typing every change.  
   Example: toggle “out of possession” and set minute range 60-90.

5. As an analyst, I want to pin key widgets and undo changes, so that iterative edits do not break the report narrative.  
   Example: pin pass network while experimenting with pressure filters.

6. As a head coach, I want response language to be switchable (technical/simplified), so that I can consume insights at the right level quickly.  
   Example: simplify jargon-heavy explanation into coaching language.

7. As an analyst, I want ambiguity handled by clarification prompts first, so that results are based on explicit assumptions.  
   Example: clarify whether “pressing weakness” means build-up phase, transition, or set piece.

8. As an analyst, I want multi-page PDF export with narrative and charts, so that I can drop findings directly into prep workflows.  
   Example: export opponent report for the upcoming fixture briefing.

## 6. Core Architecture & Patterns
### High-Level Architecture
- **Frontend (Web SPA):** chat UI, dashboard renderer, edit controls, export trigger.
- **Backend API:** auth/session, query orchestration, insight generation, dashboard spec generation.
- **Data Pipeline:** daily batch ingest from StatsBomb open data into normalized analytics store.
- **Analytics Engine:** query interpreter, tactical rule application, metric computation.
- **Reporting Service:** renders multi-page PDF from narrative + dashboard state.

### Proposed Directory Structure
```text
/apps
  /web
    /src/components
    /src/features/chat
    /src/features/dashboard
    /src/features/export
  /api
    /src/modules/auth
    /src/modules/query
    /src/modules/insights
    /src/modules/dashboard
    /src/modules/export
/services
  /ingestion
  /analytics-engine
/libs
  /shared-types
  /tactical-rules
  /chart-specs
```

### Key Patterns
- Separation of concerns between query understanding, data retrieval, and visualization selection.
- Declarative dashboard specs (JSON-driven) to support chat edits, UI edits, pinning, and undo.
- Provider abstraction layer to swap StatsBomb open data for licensed API later.
- Guardrail-first interaction pattern: clarify ambiguity and expose low-confidence warnings.

## 7. Tools/Features
### Feature 1: Tactical Chat Query
- Input: free-form football tactical question.
- Operations: intent parsing, entity extraction (team/opponent/phase/time window), tactical-rule mapping.
- Output: narrative answer + confidence signal + follow-up prompts.

### Feature 2: Dynamic Dashboard Generator
- Input: query intent + retrieved event data.
- Operations: chart recommendation engine chooses visual set based on question context.
- Output: dashboard with relevant widgets and required metadata.

### Feature 3: Conversational + Direct Editing
- Chat edits: “Show only last 15 minutes.”
- UI edits: time range selector, phase toggles, filters.
- State controls: pin widget, undo/redo, version snapshots.

### Feature 4: Export Engine
- Multi-page PDF with:
  - Insight narrative
  - All selected visuals
  - Metadata footer (competition, season, sample size)

### Feature 5: Clarification and Confidence Guardrails
- Ambiguity: ask clarification before execution.
- Low confidence/sparse sample: warning with recommendation.
- If user insists: proceed with explicit warning.

## 8. Technology Stack
### Frontend
- TypeScript
- React 18+
- Vite 5+
- Charting: ECharts or Plotly.js for football visualizations
- State management: Zustand/Redux Toolkit (dashboard state + history)

### Backend
- Node.js 20 LTS
- NestJS 10+ (or equivalent modular framework)
- REST API (MVP) with structured JSON contracts
- Queue/scheduler for daily batch jobs (e.g., BullMQ + cron)

### Data & Storage
- PostgreSQL 15+ for normalized event + derived metrics
- Redis (optional) for caching and job orchestration
- Object storage for generated PDF artifacts (optional)

### AI/ML
- LLM API for natural-language interpretation and response drafting
- Rule engine driven by analyst-authored tactical dictionary

### Third-Party Integrations
- Google OAuth 2.0
- StatsBomb open data source (MVP), provider adapter for future licensed API

## 9. Security & Configuration
### Authentication
- Google OAuth login for MVP.
- Session/token management with secure cookie strategy.

### Configuration Management
- Environment variables per environment:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `DATABASE_URL`
  - `LLM_API_KEY`
  - `STATSBOMB_SOURCE_PATH_OR_URL`
  - `JWT_SECRET` (if token-based sessions are used)

### Security Scope
- In scope:
  - Authenticated access
  - HTTPS only
  - Input validation/sanitization
  - Audit logs for query and export actions (basic)
- Out of scope (MVP):
  - Granular role-based authorization
  - Enterprise IdP integrations
  - Advanced tenant isolation

### Deployment Considerations
- Daily ETL scheduling reliability and retry handling.
- Secrets stored in managed secret store.
- Backups for analytics database.

## 10. API Specification
### `POST /api/v1/query`
- Purpose: execute tactical query and return narrative + dashboard spec.
- Auth: required (Google-authenticated session).

Request example:
```json
{
  "teamId": "arsenal",
  "opponentId": "liverpool",
  "question": "How do teams beat their high press?",
  "window": {
    "matches": 5
  },
  "audienceMode": "technical"
}
```

Response example:
```json
{
  "answer": "Opponents created most success by bypassing first-line pressure into wide channels...",
  "confidence": "medium",
  "clarificationRequired": false,
  "followUps": [
    "Do you want this split by match state?",
    "Should I isolate final 30 minutes?"
  ],
  "dashboardId": "db_123",
  "dashboardSpec": {
    "widgets": []
  },
  "metadata": {
    "competition": "Premier League",
    "season": "2025/26",
    "sampleSize": 5
  }
}
```

### `POST /api/v1/dashboard/{dashboardId}/edit`
- Purpose: apply conversational or UI edits.
- Supports pin/unpin, filter changes, chart-type changes, undo/redo hooks.

### `POST /api/v1/export/pdf`
- Purpose: generate multi-page PDF for a dashboard + narrative.
- Returns artifact URL or download stream.

## 11. Success Criteria
### MVP Success Definition
Analysts and head coaches can consistently obtain trustworthy tactical answers with supporting visuals in under 30 seconds and export reports without external tooling.

### Functional Requirements
- ✅ User can authenticate with Google and start analysis session.
- ✅ User can submit tactical queries and receive answer + dashboard.
- ✅ System asks clarifying questions when intent is ambiguous.
- ✅ Dashboard supports both chat edits and direct UI controls.
- ✅ Pinning and undo/versioning preserve dashboard integrity.
- ✅ Multi-page PDF export includes narrative + charts + metadata.
- ✅ Cross-match default analysis window is last 5 matches.

### Quality Indicators
- Median end-to-end response time <= 30s.
- Analyst rating target: >= 4.0/5.
- Coach rating target: >= 4.0/5.
- Export success rate >= 95%.
- Clarification prompt shown for ambiguous queries >= 90% of identified cases.

### UX Goals
- Minimal training required for first tactical query.
- Edit cycle under 10 seconds for common filter changes.

## 12. Implementation Phases
### Phase 1 (Weeks 1-4): Foundation & Data
**Goal:** establish product skeleton, auth, and reliable event data foundation.

Deliverables:
- ✅ Web app shell + chat layout.
- ✅ Google OAuth login.
- ✅ StatsBomb open data ingestion pipeline (daily batch).
- ✅ Normalized event schema and baseline metrics.

Validation:
- User can log in and select teams/opponents manually.
- Daily data refresh runs automatically without manual intervention.

### Phase 2 (Weeks 5-8): Query Intelligence & Initial Insights
**Goal:** deliver tactical Q&A workflow with guardrails.

Deliverables:
- ✅ Hybrid parser (LLM + analyst tactical rules).
- ✅ Clarification-first flow for ambiguous prompts.
- ✅ Insight response generation with dynamic follow-up suggestions.
- ✅ Confidence/warning handling for low-sample analysis.

Validation:
- Query accuracy benchmark accepted by analyst review set.
- Response SLA median within target in staging conditions.

### Phase 3 (Weeks 9-12): Dashboard Generation & Editing
**Goal:** make insights visual and iteratively editable.

Deliverables:
- ✅ Auto-widget dashboard generation (4 chart families).
- ✅ Conversational dashboard editing.
- ✅ UI-based controls (time range/phase filters).
- ✅ Pin widgets + undo/versioning.

Validation:
- Generated visuals align to query intent in analyst UAT.
- Edits do not break pinned components.

### Phase 4 (Weeks 13-15): Export, Hardening, and Launch Readiness
**Goal:** close reporting loop and productionize MVP.

Deliverables:
- ✅ Multi-page PDF export with narrative + visuals + metadata.
- ✅ Performance hardening and monitoring dashboards.
- ✅ In-app analyst/coach rating collection.
- ✅ Production deployment checklist completion.

Validation:
- Export reliability >= 95% in test runs.
- Pilot users can run end-to-end workflow unaided.

## 13. Future Considerations
- Licensed StatsBomb API integration with wider match coverage.
- Multi-user collaboration and shared workspaces.
- Role differentiation (analyst vs coach permissions).
- Editable narrative blocks before export.
- Club branding/templates in exported reports.
- Real-time/live match workflows.
- Long-term opponent memory and season-over-season comparisons.
- Billing and entitlement model (per-club packaging).

## 14. Risks & Mitigations
1. **Data coverage risk (open data limitations).**  
   Mitigation: provider abstraction layer + clear coverage indicators + priority path to licensed API.

2. **Insight trust risk from LLM interpretation errors.**  
   Mitigation: hybrid parser with analyst-maintained tactical rules, mandatory clarifications for ambiguity, sample-size warnings.

3. **Performance risk against <30s SLA.**  
   Mitigation: precomputed aggregates, caching common queries, async chart spec rendering, performance budgets.

4. **Visualization mismatch risk (wrong chart for question).**  
   Mitigation: intent-to-widget mapping rules + analyst override controls + ongoing feedback loop from ratings.

5. **Adoption risk among coaches (too technical).**  
   Mitigation: audience-mode switch, concise summary-first responses, coach-specific validation sessions.

## 15. Appendix
### Key Assumptions
- “Current season” is constrained by available StatsBomb open data until licensed access is secured.
- Single-user mode is sufficient for MVP pilot rollout.
- Daily batch updates satisfy operational needs for initial use.

### Metrics to Instrument
- Query latency and chart render latency.
- Clarification rate and follow-up acceptance rate.
- Export completion/failure rate.
- Analyst and coach ratings per session.

### Suggested Project Artifacts
- `docs/prd/PRD.md` (this document location can be moved post-approval).
- `docs/architecture/system-design.md`
- `docs/data/tactical-dictionary.md`
- `docs/qa/mvp-acceptance-tests.md`
