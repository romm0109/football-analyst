export type AudienceMode = "technical" | "simplified";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface AnalysisWindow {
  matches: number;
}

export interface TeamContext {
  teamId: string;
  opponentId: string;
  window: AnalysisWindow;
}

export interface QueryIntent {
  tacticalConcept: string;
  phase: "in_possession" | "out_of_possession" | "transition" | "set_piece";
  minuteRange?: {
    from: number;
    to: number;
  };
  ambiguous: boolean;
  ambiguityReason: string | null;
}

export interface DashboardWidget {
  id: string;
  type: "pitch_zones" | "pass_network" | "xg_timeline" | "pressure_map";
  pinned: boolean;
  filters: {
    minuteFrom?: number;
    minuteTo?: number;
    phase?: QueryIntent["phase"];
  };
}

export interface DashboardMetadata {
  competition: string;
  season: string;
  sampleSize: number;
}

export interface DashboardSpec {
  dashboardId: string;
  widgets: DashboardWidget[];
  metadata: DashboardMetadata;
  version: number;
}

export interface QueryResponse {
  queryId: string;
  answer: string;
  confidence: ConfidenceLevel;
  warning: string | null;
  clarificationRequired: boolean;
  requiresFollowUp: boolean;
  followUps: string[];
  dashboardId: string;
  dashboardSpec: DashboardSpec;
  metadata: DashboardMetadata;
}

export interface FeedbackRatingInput {
  userId: string;
  queryId: string;
  roleType: "analyst" | "coach";
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}
