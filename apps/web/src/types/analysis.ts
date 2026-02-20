export type AudienceMode = "technical" | "simplified";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface TeamContext {
  teamId: string;
  opponentId: string;
  window: {
    matches: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: "pitch_zones" | "pass_network" | "xg_timeline" | "pressure_map";
  pinned: boolean;
  filters: {
    minuteFrom?: number;
    minuteTo?: number;
    phase?: "in_possession" | "out_of_possession" | "transition" | "set_piece";
  };
}

export interface DashboardSpec {
  dashboardId: string;
  widgets: DashboardWidget[];
  metadata: {
    competition: string;
    season: string;
    sampleSize: number;
  };
  version: number;
}

export interface QueryResult {
  queryId: string;
  answer: string;
  confidence: ConfidenceLevel;
  warning: string | null;
  clarificationRequired: boolean;
  requiresFollowUp: boolean;
  followUps: string[];
  dashboardId: string;
  dashboardSpec: DashboardSpec;
}
