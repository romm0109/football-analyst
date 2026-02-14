# Product Requirements Document: The Generative Tactical Analyst

## 1. Executive Summary

The Generative Tactical Analyst is an AI-powered football analytics platform that enables coaches and analysts to interact with complex match data through natural language queries. Instead of navigating complicated spreadsheets or static PDF reports, users simply ask questions in plain English and receive instant, visual answers generated on an interactive football pitch.

The platform addresses a critical pain point in modern football: while clubs generate millions of data points per match (xG, PPDA, Pass Networks), 99% of coaches are not data scientists. Existing tools like Wyscout or Opta rely on pre-set dashboards with rigid filtering options, forcing analysts to spend 20+ hours weekly manually tagging video to find specific insights.

Our MVP delivers a Chat Interface combined with tactical dashboards, all powered by a **pluggable data adapter architecture** in the NestJS server. The client consumes processed data from our API, allowing us to switch providers without client changes.

**Key Architectural Decision:** We will NOT use mock data. The NestJS server will keep the adapter abstraction, and the first concrete provider will be a dedicated Python Understat service (using the `understat` package), so we can add future providers without changing client code.

---

## 2. Mission

**Mission Statement:** Democratize football analytics by enabling any coach or analyst to extract actionable tactical insights through natural language, transforming raw data into visual intelligence in seconds.

**Core Principles:**

1. **Simplicity First** - Complex data should be accessible through simple conversation, not complicated filters
2. **Visual Intelligence** - Every answer renders as a meaningful visualization on a football pitch
3. **Extensibility** - Architecture must support multiple data sources without code changes to the presentation layer
4. **Speed over Completeness** - Deliver instant answers to specific questions rather than overwhelming users with everything
5. **Coach-Centric Design** - Built for head coaches and assistants, not just professional analysts

---

## 3. Target Users

### Primary Personas

| Persona | Description | Technical Comfort |
|---------|-------------|-------------------|
| **Head Coach** | Premier League/Championship manager preparing for Saturday match | Low - wants answers, not data tables |
| **Assistant Analyst** | Works directly with head coach, creates pre-match briefs | Medium - comfortable with basic dashboards |
| **Video Analyst** | Tags match footage, spends 20+ hrs/week on manual analysis | High - understands event data |
| **Academy Director** | Evaluates youth players across multiple matches | Low-Medium - needs quick player comparisons |

### Key Pain Points

- **Data Overload**: Millions of data points per match but no way to ask specific questions
- **Static Tools**: Pre-built dashboards don't answer unique tactical questions like "How does their Right Back perform against left-footed wingers?"
- **Time Poverty**: 20+ hours weekly spent manually tagging video to find specific insights
- **Technical Barrier**: Existing tools require professional analyst training to navigate effectively

### User Needs

- Ask tactical questions in plain English and receive instant visual answers
- Identify opponent weaknesses in under 30 seconds, not 4 hours
- See results overlaid on a football pitch for immediate tactical understanding
- Switch between data sources without changing how they use the tool

---

## 4. MVP Scope

### Core Functionality

| Feature | Status | Priority |
|---------|--------|----------|
| Natural language query interface | ✅ In Scope | P0 |
| Momentum Wave dashboard (xG timeline) | ✅ In Scope | P0 |
| Shot Map dashboard (xG scatter) | ✅ In Scope | P0 |
| Team xG Analysis dashboard | ✅ In Scope | P1 |
| Player xG Analysis dashboard | ✅ In Scope | P1 |
| Football pitch SVG visualization component | ✅ In Scope | P0 |
| Query result rendering as dashboard components | ✅ In Scope | P0 |
| Server-side data adapter layer | ✅ In Scope | P0 |
| Multi-user authentication system | ✅ In Scope | P2 |
| Team/player selection filters | ✅ In Scope | P1 |
| Match/season date selection | ✅ In Scope | P1 |

### Technical Architecture

| Feature | Status | Priority |
|---------|--------|----------|
| NX Monorepo (server + client) | ✅ In Scope | P0 |
| NestJS server application | ✅ In Scope | P0 |
| React client application | ✅ In Scope | P0 |
| Data adapter interface (IFootballAdapter) | ✅ In Scope | P0 |
| Server-side adapter implementations | ✅ In Scope | P0 |
| Python Understat service (microservice) | In Scope | P0 |
| Query object abstraction layer | ✅ In Scope | P0 |
| TypeScript type definitions for all entities | ✅ In Scope | P0 |
| React + Vite client setup | ✅ In Scope | P0 |
| Recharts integration for visualizations | ✅ In Scope | P0 |

### Integration

| Feature | Status | Priority |
|---------|--------|----------|
| Python Understat service integration | In Scope | P0 |
| football-data.org API integration | ❌ Out of Scope | Future |
| StatsBomb API integration | ❌ Out of Scope | Future |
| Opta API integration | ❌ Out of Scope | Future |
| Video clip integration | ❌ Out of Scope | Future |
| Real-time match data streaming | ❌ Out of Scope | Future |

### Deployment

| Feature | Status | Priority |
|---------|--------|----------|
| Production build optimization | ❌ Out of Scope | Future |
| Cloud deployment (AWS/Vercel) | ❌ Out of Scope | Future |
| CI/CD pipeline setup | ❌ Out of Scope | Future |
| Performance optimization | ❌ Out of Scope | Future |

---

## 5. User Stories

### Primary User Stories

**Story 1: The Pre-Match Question**
> As a Head Coach, I want to ask "Show me where Arsenal lost possession in their own half during the last 3 games," so that I can identify defensive vulnerabilities to exploit in Saturday's match.

*Example:* The coach logs in Monday morning, types the query, and sees a pitch map with red dots marking every turnover in Arsenal's defensive third. A sidebar lists players responsible, sorted by frequency.

**Story 2: The Key Player Analysis**
> As an Assistant Analyst, I want to know "Who is Man City's most dangerous passer into the box, and where do they usually pass from?" so that I can prepare specific defensive instructions for my defenders.

*Example:* Query returns Kevin De Bruyne as top result with a heatmap glowing red in the Right Half-Space - the manager knows to double-team that zone.

**Story 3: The Midfielder Profile**
> As a Video Analyst, I want to see "Does this midfielder only pass backward?" so that I can identify which midfielders lack progressive passing ability.

*Example:* The Passing Sonar radar chart shows short spikes in forward directions, confirming the suspicion - the midfielder needs support to progress play.

**Story 4: The Fatigue Pattern**
> As a Head Coach, I want to know "When do they concede most goals?" so that I can instruct my team to press harder in specific match periods.

*Example:* The Momentum Wave shows the opponent conceding 60% of goals between minutes 75-90, indicating fitness issues.

**Story 5: The Defensive Gap**
> As an Assistant Analyst, I want to see "Who covers for whom defensively?" so that I can identify weak links in the opponent's back line.

*Example:* The Defensive Skeleton network graph shows thin/long lines between center-backs, revealing a stretched defense that can be exploited through the middle.

**Story 6: The Data Switch**
> As a Technical Lead, I want to switch data providers without changing the UI, so that the platform remains functional as data sources evolve.

*Example:* Configuration change swaps `UnderstatPythonAdapter` for `StatsBombAdapter`; all dashboards continue working identically.

### Technical User Stories

**Story 7: The New Dashboard**
> As a Developer, I want to add a new dashboard type by implementing a query handler, so that the platform grows without architectural changes.

*Example:* Developer creates a new query type, registers it with the QueryResolver, and the chat interface automatically supports it.

**Story 8: The Multi-Team View**
> As an Academy Director, I want to compare multiple players in a single view, so that I can evaluate which youth players deserve advancement.

*Example:* Select 3 players, query "compare their passing," and see three Passing Sonar charts in a grid layout.

---

## 6. Core Architecture & Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ Chat Interface│  │  Dashboards   │  │  Navigation/Layout       │   │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘   │
├─────────┴─────────────────┴───────────────────────┴──────────────────┤
│                    Client API Layer                                  │
│              (REST calls to our server)                             │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVER (NestJS)                              │
│  ┌────────────────────────┐  ┌──────────────────────────────────┐   │
│  │    Query Controller     │  │     Query Resolver                │   │
│  │  (REST Endpoints)      │  │  (NLP → Query Object)            │   │
│  └───────────┬────────────┘  └────────────────┬───────────────────┘   │
├──────────────┴───────────────────────────────┴──────────────────────┤
│                     Data Adapter Interface                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  IFootballAdapter (getMatches, getEvents, getPlayers, etc.) │    │
│  └───────────────────────────────┬─────────────────────────────┘    │
├──────────────────────────────────┴──────────────────────────────────┤
│                     Adapter Implementations                          │
│  ┌───────────┐  ┌──────────────────┐  ┌────────────────────────┐  │
│  │Football-  │  │    StatsBomb     │  │   Future APIs          │  │
│  │  data.org │  │    (future)      │  │   (Opta, Wyscout)     │  │
│  └───────────┘  └──────────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Monorepo Structure (NX)

```
football-analyst/
├── apps/
│   ├── client/          # React + Vite application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Pitch/
│   │   │   │   ├── dashboards/
│   │   │   │   ├── Chat/
│   │   │   │   └── Layout/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── App.tsx
│   │   └── package.json
│   │
│   └── server/         # NestJS API server
│       ├── src/
│       │   ├── data-adapter/
│       │   │   ├── interfaces/
│       │   │   ├── adapters/
│       │   │   └── factory/
│       │   ├── query/
│       │   ├── controllers/
│       │   └── main.ts
│       └── package.json
│
├── libs/
│   └── shared-types/   # Shared TypeScript types
│       └── src/
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

### Design Patterns

1. **Adapter Pattern** - IFootballAdapter interface allows pluggable data sources
2. **Factory Pattern** - AdapterFactory creates appropriate adapter based on configuration
3. **Query Object Pattern** - Queries represented as structured objects, not SQL strings
4. **Component Composition** - Dashboards built from reusable sub-components (Pitch, Charts)
5. **Hook-Based State** - React hooks encapsulate data fetching and query logic

---

## 7. Tools/Features

### Feature 1: Chat Query Interface

**Purpose:** Allow users to ask questions in natural language

**Operations:**
- Text input for natural language queries
- Predefined query buttons for common questions
- Query history display
- Loading states during query execution

**Key Features:**
- Auto-complete suggestions based on available data
- Query validation with helpful error messages
- Support for team, player, and date filters
- Results render as appropriate dashboard component

**Example Queries Supported:**
- "Show me passes into the box for Arsenal"
- "Where does Liverpool lose possession?"
- "Compare Man City midfielders' passing"
- "When do they score most goals?"

### Feature 2: Pressing Triggers Dashboard (Event Map)

**Purpose:** Identify where the opponent makes mistakes under pressure

**Visualization:** Scatter plot overlaid on football pitch SVG

**Data Points:**
- Bad passes immediately after being pressured
- Color-coded by result (Interception, Throw-in, Turnover)
- Clickable markers showing event details

**Interactivity:**
- Filter by team, player, match date range
- Hover for event details
- Zoom/pan on pitch
- Toggle between result types

### Feature 3: Passing Sonar Dashboard (Polar Chart)

**Purpose:** Analyze a midfielder's passing direction tendencies

**Visualization:** 360-degree radar/spider chart with directional spikes

**Data Points:**
- Pass frequency by direction (8-12 sectors)
- Pass success rate by direction
- Progressive vs. lateral vs. backward passes
- Key pass locations

**Interactivity:**
- Select player from dropdown
- Compare up to 3 players in grid
- Toggle between frequency and success rate
- Filter by pass type (key passes, through balls, crosses)

### Feature 4: Momentum Wave Dashboard (Timeline)

**Purpose:** Identify when teams are most vulnerable/dominant

**Visualization:** Area chart with gradient fill showing xT over time

**Data Points:**
- Expected Threat (xT) per minute
- Team in possession indicator
- Key event markers (goals, red cards)
- Rolling average trend line

**Interactivity:**
- Select match from dropdown
- Zoom to specific time periods
- Toggle between teams
- Add event markers for goals/substitutions

### Feature 5: Defensive Skeleton Dashboard (Network Graph)

**Purpose:** Analyze defensive positioning and coverage

**Visualization:** Network/graph showing player connections

**Data Points:**
- Lines between defenders showing distance
- Line thickness = compactness (closer = thicker)
- Average positions of defensive unit
- Spaces between lines = gaps to exploit

**Interactivity:**
- Select defensive unit (back 4, back 3, etc.)
- Filter by match phase (defending, transition, set-piece)
- Animate positions over time
- Highlight overloaded zones

### Feature 6: Data Adapter System

**Purpose:** Enable pluggable data sources

**Operations:**
- getTeams(): Promise<ITeam[]>
- getMatches(teamId?: string, dateFrom?: string): Promise<IMatch[]>
- getEvents(matchId: string, eventTypes?: EventType[]): Promise<IEvent[]>
- getPlayers(teamId: string): Promise<IPlayer[]>
- getEventStats(matchId: string): Promise<IEventStats>

**Key Features:**
- Single interface for all data sources
- Automatic error handling and retry logic
- Response caching for performance
- Request/response logging for debugging

---

## 8. Technology Stack

### Architecture Overview

This is an **NX Monorepo** with two core applications plus one data microservice:
- **Server**: NestJS (handles API calls, query resolution, adapter orchestration)
- **Client**: React + Vite (UI, dashboards, visualizations)
- **Understat Service**: Python service wrapping `amosbastian/understat` for data retrieval

### Server Technologies (NestJS)

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.x | Node.js framework |
| TypeScript | 5.x | Type safety |
| axios | 1.x | HTTP client for external APIs |
| class-validator | 0.14.x | Request validation |
| Swagger/OpenAPI | 7.x | API documentation |


### Understat Service Technologies (Python)

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Runtime |
| FastAPI | 0.11x | Service API layer |
| understat (`amosbastian/understat`) | latest | Understat data client |
| uvicorn | 0.2x | ASGI server |
| pydantic | 2.x | Validation and response models |

### Client Technologies (React)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| Vite | 5.x | Build tool |
| TypeScript | 5.x | Type safety |
| React Router | 6.x | Client-side routing |
| Recharts | 2.x | Charts (Radar, Area, Bar) |
| D3.js | 7.x | Custom visualizations (Network graph) |
| React Query | 5.x | Server state management |
| Zustand | 4.x | Client state (user preferences) |
| Tailwind CSS | 3.x | Styling |
| Lucide React | 0.x | Icons |

### Shared Dependencies

```json
{
  "dependencies": {
    "typescript": "^5.3.0"
  }
}
```

### Third-Party Integrations

#### MVP Data Sources

| Service | Data Type | Status |
|---------|-----------|--------|
| Python Understat Service (`amosbastian/understat`) | xG, shots, coordinates (7 leagues) | MVP |
| NestJS Understat adapter | Normalized domain entities for client dashboards | MVP |

#### Future Integrations

| Service | Data Type | Status |
|---------|-----------|--------|
| football-data.org | Fixtures, standings, basic stats (60+ leagues) | Future |
| API-Football | Extended stats (200+ leagues) | Future |
| StatsBomb | Full event data | Future |
| Opta | Industry standard data | Future |
| Wyscout | Video + event data | Future |

---

## 8.1 Football Data API Research Findings

### Critical Finding: Not All APIs Provide Pitch Coordinates

After researching multiple football data providers, we discovered a **critical distinction**:

| API | x,y Coordinates | Pass Details | xG Data | Pricing |
|-----|----------------|--------------|---------|---------|
| **StatsBomb** | ✅ Yes | ✅ Full detail | ✅ Yes | Enterprise |
| **Opta** | ✅ Yes | ✅ Full detail | ✅ Yes | Enterprise |
| **Wyscout** | ✅ Yes | ✅ Full detail | ✅ Yes | Enterprise |
| **Understat** | ✅ Yes | ⚠️ Shots only | ✅ Yes | Free |
| **API-Football** | ⚠️ Limited | ⚠️ Basic | ⚠️ Some | €70-90/mo |
| **football-data.org** | ❌ No | ❌ Basic | ❌ No | €90/year |

### API Selection: Understat + Adapter Pattern

**Decision:** Use Understat as primary data source via a dedicated Python service, while keeping the NestJS adapter pattern for future provider expansion.

**Why Understat:**
- ✅ Free - no cost to start
- ✅ Has x,y coordinates for shots
- ✅ Has xG data for every shot
- ✅ Covers 7 major leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Russia, Greece)
- ✅ Clean, well-documented JSON API

**Service + Adapter Pattern:**
- For MVP: NestJS calls the internal Python Understat service
- Architecture: Keep provider-agnostic IFootballAdapter in NestJS so paid APIs can be added later
- Adapter interface supports: matches, teams, players, events, and stats

**Understat Data Provided:**
- Match dates and results
- xG for each shot
- Shot coordinates (x, y) on pitch
- Assists and key passes
- Goals and expected goals (xG)
- Minutes played
- Player and team names

**Leagues Supported (Understat):**
- Premier League (EPL)
- La Liga
- Serie A
- Bundesliga
- Ligue 1
- Russian Premier League
- Greek Super League

**Impact on MVP Dashboards:**
- ✅ **Momentum Wave** - Can show xG timeline (goals + xG)
- ✅ **Shot Map** - Can show shot locations with xG
- ✅ **Basic Stats** - From free API tiers (league tables, basic match info)
- ⚠️ **Passing Sonar** - Cannot build (no pass data)
- ❌ **Pressing Triggers** - Cannot build (no turnover data)
- ❌ **Defensive Skeleton** - Cannot build (no position data)

**MVP Dashboard Adjustment:**
For MVP, we'll focus on dashboards that work with available data:
1. **Momentum Wave** - xG flow over time
2. **Shot Map** - Where shots are taken from
3. **Basic Stats** - League tables, team info (from free API tiers)

---

### Architecture Implication

1. **Server handles data transformation** - Aggregate and transform available data
2. **Adapter pattern essential** - Easy to swap stats API when budget allows
3. **MVP dashboards limited to available data** - Focus on xG and shot analysis
4. **Future expansion** - Add StatsBomb/Opta for full event data later
| Wyscout | Video + event data | Future |

---

## 9. Security & Configuration

### Authentication & Authorization

**In Scope:**
- Email/password authentication
- JWT token-based sessions
- Role-based access (Admin, Analyst, Viewer)
- Session persistence

**Out of Scope:**
- OAuth (Google, GitHub)
- Two-factor authentication
- SSO integration
- API key management

### Configuration Management

**Environment Variables:**
```
# Server
SERVER_PORT=3000
API_FOOTBALL_DATA_API_KEY=your_api_key

# Client
VITE_API_URL=http://localhost:3000
```

**Runtime Configuration:**
```typescript
interface AppConfig {
  serverUrl: string;
  apiKey?: string;
  cacheTimeout: number;
  maxRetries: number;
}
```

### Security Scope

**In Scope:**
- Password hashing (bcrypt)
- JWT token validation
- XSS prevention (React default)
- Input validation on forms

**Out of Scope:**
- CSRF protection
- Rate limiting
- Audit logging
- Data encryption at rest

---

## 10. API Specification

### Data Adapter Interface

```typescript
// src/data-adapter/interfaces/IFootballAdapter.ts

interface IFootballAdapter {
  // Teams
  getTeams(): Promise<ITeam[]>;
  getTeamById(id: string): Promise<ITeam | null>;

  // Matches
  getMatches(filters?: MatchFilters): Promise<IMatch[]>;
  getMatchById(id: string): Promise<IMatch | null>;
  getMatchEvents(matchId: string): Promise<IEvent[]>;

  // Players
  getPlayers(teamId: string): Promise<IPlayer[]>;
  getPlayerById(id: string): Promise<IPlayer | null>;

  // Statistics
  getTeamStats(teamId: string, dateRange?: DateRange): Promise<ITeamStats>;
  getPlayerStats(playerId: string): Promise<IPlayerStats>;
}

interface MatchFilters {
  teamId?: string;
  dateFrom?: string;
  dateTo?: string;
  competition?: string;
  status?: 'finished' | 'upcoming' | 'live';
}

type EventType =
  | 'pass'
  | 'shot'
  | 'tackle'
  | 'interception'
  | 'foul'
  | 'card'
  | 'corner'
  | 'free_kick'
  | 'penalty'
  | 'own_goal'
  | 'substitution';
```

### Core Data Types

```typescript
// src/data-adapter/interfaces/IMatch.ts
interface IMatch {
  id: string;
  homeTeam: ITeam;
  awayTeam: ITeam;
  homeScore: number;
  awayScore: number;
  date: string;
  competition: string;
  venue: string;
  status: 'finished' | 'upcoming' | 'live';
  minute?: number;
}

// src/data-adapter/interfaces/IEvent.ts
interface IEvent {
  id: string;
  matchId: string;
  type: EventType;
  minute: number;
  second: number;
  team: ITeam;
  player: IPlayer;

  // Location data (normalized 0-100)
  location?: {
    x: number;
    y: number;
  };

  // Pass-specific fields
  pass?: {
    recipient?: IPlayer;
    endLocation: { x: number; y: number };
    outcome?: 'complete' | 'incomplete';
    type?: 'regular' | 'through_ball' | 'cross' | 'free_kick' | 'corner';
  };

  // Shot-specific fields
  shot?: {
    outcome: 'goal' | 'saved' | 'missed' | 'blocked';
    xG: number;
    bodyPart: 'foot' | 'head' | 'other';
  };

  // Tackle/Interception
  duel?: {
    outcome: 'won' | 'lost';
    type: 'tackle' | 'interception' | 'clearance';
  };
}

// src/data-adapter/interfaces/IPlayer.ts
interface IPlayer {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  team: ITeam;
  nationality: string;
  age: number;
  photoUrl?: string;
}

// src/data-adapter/interfaces/ITeam.ts
interface ITeam {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}
```

### Query Object Structure

```typescript
// src/query/types/QueryTypes.ts

interface QueryObject {
  id: string;
  type: QueryType;
  filters: QueryFilters;
  aggregation: AggregationType;
  createdAt: Date;
}

type QueryType =
  | 'possession_loss'
  | 'passes_into_box'
  | 'passing_directions'
  | 'momentum_timeline'
  | 'defensive_positions'
  | 'pressing_events'
  | 'shot_map'
  | 'player_comparison';

interface QueryFilters {
  teams?: string[];           // Team IDs
  players?: string[];          // Player IDs
  matches?: string[];          // Match IDs
  dateRange?: {
    from: string;
    to: string;
  };
  location?: {
    zone?: 'own_half' | 'opponent_half' | 'box' | 'half_space';
    xRange?: [number, number];
    yRange?: [number, number];
  };
  eventTypes?: EventType[];
  outcome?: ('complete' | 'incomplete')[];
}

type AggregationType =
  | 'count'        // Total count
  | 'list'         // Array of events
  | 'heatmap'      // Density map
  | 'grouped'      // Grouped by player/team
  | 'timeline';   // Time-series
```

---

## 11. Success Criteria

### MVP Success Definition

The MVP is considered successful when:

1. A user can register and log in to the platform
2. A user can ask a natural language query and receive a visual answer
3. MVP dashboards render correctly with real data from the Python Understat service
4. The data adapter can be swapped without code changes
5. The application builds without errors

### Functional Requirements

| Requirement | Success Condition |
|-------------|-------------------|
| Chat Interface | User can type a query and see results |
| Pressing Triggers | Scatter plot shows events on pitch |
| Passing Sonar | Radar chart shows directional passing |
| Momentum Wave | Area chart shows xT over time |
| Defensive Skeleton | Network graph shows defensive positions |
| Data Adapter | Understat-backed adapter returns normalized entities |
| Query System | Query object correctly filters data |
| User Auth | Registration and login functional |
| Team/Player Selection | Dropdowns populate with data |
| Responsive Design | Works on desktop (1280px+) |

### Quality Indicators

- **Performance:** Dashboard renders in < 2 seconds with real MVP data
- **Usability:** New user can run first query in < 5 minutes
- **Reliability:** No console errors during normal operation
- **Maintainability:** New adapter can be added in < 1 hour

### User Experience Goals

1. **Instant Gratification:** First query returns results in under 3 seconds
2. **Visual Clarity:** Dashboard meaning is immediately obvious
3. **Error Handling:** Invalid queries show helpful messages
4. **Navigation:** User can switch dashboards in one click

---

## 12. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Set up NX monorepo, server, client, and data layer

**Deliverables:**
- ✅ Initialize NX monorepo with apps
- ✅ Set up NestJS server application
- ✅ Set up React + Vite client application
- ✅ Configure Tailwind CSS
- ✅ Create shared TypeScript interfaces (IMatch, IEvent, IPlayer, ITeam, IFootballAdapter)
- ✅ Implement Understat Python service (using `amosbastian/understat`)
- ✅ Implement NestJS Understat adapter that consumes the Python service
- ✅ Create AdapterFactory for adapter selection
- ✅ Build FootballPitch SVG component with all markings
- ✅ Set up React Query provider and Zustand store

**Validation Criteria:**
- Both server and client run with `npm run start:dev` and `npm run start`
- Server exposes REST endpoints for teams, matches, events
- FootballPitch renders correctly
- API calls work through the adapter

---

### Phase 2: Core Dashboards (Week 3-4)

**Goal:** Build the four primary dashboards

**Deliverables:**
- ✅ Pressing Triggers (Scatter plot on pitch)
- ✅ Passing Sonar (Recharts Radar chart)
- ✅ Momentum Wave (Recharts Area chart)
- ✅ Defensive Skeleton (D3 Network graph)
- ✅ Create reusable chart components
- ✅ Add filter controls (team, player, date)
- ✅ Connect dashboards to server API

**Validation Criteria:**
- All four dashboards render with API data
- Filters correctly update displayed data
- Charts are interactive (hover, click)

---

### Phase 3: Query System & Chat (Week 5-6)

**Goal:** Build the chat interface and query resolution

**Deliverables:**
- ✅ Create QueryBuilder class on server
- ✅ Implement QueryResolver (simple keyword matching)
- ✅ Build ChatInterface component with input and buttons
- ✅ Add predefined query buttons
- ✅ Connect chat to dashboard rendering
- ✅ Implement result display switching based on query type

**Validation Criteria:**
- User can type query and see appropriate dashboard
- Predefined buttons trigger correct dashboards
- Query history is displayed

---

### Phase 4: Multi-User & Polish (Week 7-8)

**Goal:** Add authentication and polish the experience

**Deliverables:**
- ✅ Implement user registration/login on server
- ✅ Add JWT authentication flow
- ✅ Create user roles (Admin, Analyst, Viewer)
- ✅ Add loading states and error handling
- ✅ Polish UI with consistent styling
- ✅ Add responsive layout
- ✅ Create sample user accounts for testing

**Validation Criteria:**
- New user can register and log in
- Protected routes require authentication
- UI is polished and consistent
- Application is production-ready

---

## 13. Future Considerations

### Post-MVP Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| **Additional API Integrations** | Connect football-data.org, StatsBomb, Opta via new adapters | High |
| **Video Clips** | Link events to video highlight clips | High |
| **NLP Improvement** | Better natural language understanding | Medium |
| **Advanced Filters** | More granular query filters | Medium |
| **Mobile App** | React Native companion app | Low |
| **Sharing** | Share dashboards via link | Low |
| **Annotations** | Add notes to dashboards | Low |
| **PDF Export** | Export dashboards as reports | Low |

### Integration Opportunities

1. **Wyscout Integration** - Access to video library
2. **StatsBomb API** - Advanced expected goals (xG) and passing data
3. **Opta** - Industry-standard match data
4. **Training Data** - Connect to training ground analytics
5. **Wearable Data** - GPS/heart rate integration

### Advanced Features (Future Phases)

- **Opposition Reports** - Automated pre-match briefs
- **Set Piece Analysis** - Dedicated set piece dashboard
- **Player Comparison Tool** - Side-by-side radar charts
- **Trend Analysis** - Performance over time
- **Custom Alerts** - Notify when opponent changes tactics
- **AI Recommendations** - Suggested queries based on matchup

---

## 14. Risks & Mitigations

### Risk 1: Data Quality from Free/Low-Cost APIs

**Description:** Free or affordable APIs may have incomplete or inaccurate event data, affecting dashboard accuracy.

**Mitigation:**
- Use real Understat data from day one
- Design adapters to handle missing fields gracefully
- Document data quality expectations for each API
- Plan for manual data correction tools in future

### Risk 2: Query Resolution Complexity

**Description:** Natural language queries may be ambiguous, leading to incorrect results.

**Mitigation:**
- Start with predefined query buttons as primary input
- Implement query confirmation ("Did you mean...?")
- Add query feedback mechanism
- Limit MVP to clear, unambiguous query types

### Risk 3: Visualization Performance

**Description:** Large datasets (thousands of events) may cause slow rendering.

**Mitigation:**
- Implement data aggregation before rendering
- Use canvas for large scatter plots
- Add pagination for event lists
- Optimize Recharts with memoization

### Risk 4: Scope Creep

**Description:** Four dashboards + chat + auth may exceed MVP timeline.

**Mitigation:**
- Strictly prioritize features (P0/P1/P2)
- Cut scope to 2-3 dashboards if needed
- Use feature flags for incomplete features
- Focus on quality over quantity

### Risk 5: API Changes

**Description:** Third-party APIs may change response formats, breaking adapters.

**Mitigation:**
- Adapter pattern isolates API-specific code
- Add response validation in adapters
- Create adapter test suites
- Version the adapter interface

---

## 15. Appendix

### Key Dependencies with Links

#### Server (NestJS)

| Package | Link |
|---------|------|
| NestJS | https://nestjs.com |
| TypeScript | https://www.typescriptlang.org |
| axios | https://axios-http.com |
| class-validator | https://github.com/typestack/class-validator |

#### Client (React)

| Package | Link |
|---------|------|
| React | https://react.dev |
| Vite | https://vitejs.dev |
| TypeScript | https://www.typescriptlang.org |
| Recharts | https://recharts.org |
| D3.js | https://d3js.org |
| React Query | https://tanstack.com/query |
| Zustand | https://zustand-demo.pmnd.rs |
| Tailwind CSS | https://tailwindcss.com |

### Football Data APIs

| API | Pricing | Coordinates | Link |
|-----|---------|-------------|------|
| Understat | Free | ✅ Yes | https://understat.com |
| football-data.org | €90/year | ❌ No | https://www.football-data.org |
| StatsBomb | Enterprise | ✅ Yes | https://statsbomb.com |
| Opta | Enterprise | ✅ Yes | https://optapl.com |
| API-Football | €70-90/month | ⚠️ Limited | https://www.api-football.com |

### Understat API Details

**Base URL:** `https://understat.com`

**Endpoints:**
- `GET /league/{league}` - League data (dates, matches)
- `GET /team/{team}/{season}` - Team season data
- `GET /player/{player}` - Player season data

**Data Provided:**
- Match dates and results
- xG for each shot
- Shot coordinates (x, y) on pitch
- Assists and key passes
- Goals and expected goals (xG)
- Minutes played
- Player and team names

**Leagues Supported:**
- Premier League (EPL)
- La Liga
- Serie A
- Bundesliga
- Ligue 1
- Russian Premier League
- Greek Super League

### API Data Flow

```
Client               NestJS API               Python Understat Service         Understat
  |                     |                                 |                       |
  |--- GET /api/teams ->|                                 |                       |
  |                     |--- GET /understat/teams ------->|                       |
  |                     |                                 |--- fetch via lib ----->|
  |                     |                                 |<-- raw understat ------|
  |                     |<-- normalized teams ------------|                       |
  |<-- Teams (JSON) ----|                                 |                       |
```

### No Mock Data

This project uses **real API data from day one**. The adapter pattern allows:
- Fetching from Understat via the Python service initially
- Swapping to StatsBomb/Opta when budget allows
- All transformations happen on the server
- Client receives consistent data format regardless of source

### Naming Conventions

- Interfaces: `I*` prefix (IMatch, IEvent)
- Types: PascalCase
- Components: PascalCase (PressingTriggers.tsx)
- Hooks: camelCase with use* prefix (useFootballData)
- Utils: camelCase (coordinateUtils.ts)
- Constants: UPPER_SNAKE_CASE

---

## Document Information

- **Version:** 1.0
- **Status:** Draft for Review
- **Created:** 2026-02-13
- **Last Updated:** 2026-02-13

---

*This PRD defines the MVP scope for The Generative Tactical Analyst. All features marked as "Out of Scope" are planned for future phases and require separate planning.*



