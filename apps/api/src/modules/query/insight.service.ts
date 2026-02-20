import {
  AudienceMode,
  ConfidenceLevel,
  DashboardMetadata,
  DashboardWidget,
} from "../../../../../libs/shared-types/src";
import { TacticalDictionaryEntry } from "./tactical-dictionary";

export interface InsightInput {
  teamId: string;
  opponentId: string;
  question: string;
  audienceMode: AudienceMode;
  matches: number;
  matchedEntry: TacticalDictionaryEntry | null;
}

export interface InsightResult {
  answer: string;
  confidence: ConfidenceLevel;
  warning: string | null;
  requiresFollowUp: boolean;
  followUps: string[];
  widgets: DashboardWidget[];
  metadata: DashboardMetadata;
}

function defaultWidgets(
  preferredType: DashboardWidget["type"],
): DashboardWidget[] {
  const widgets: DashboardWidget[] = [
    { id: "w_pitch", type: "pitch_zones", pinned: false, filters: {} },
    { id: "w_pass", type: "pass_network", pinned: false, filters: {} },
    { id: "w_pressure", type: "pressure_map", pinned: false, filters: {} },
    { id: "w_xg", type: "xg_timeline", pinned: false, filters: {} },
  ];

  return widgets.sort(
    (a, b) =>
      Number(b.type === preferredType) - Number(a.type === preferredType),
  );
}

export class InsightService {
  build(input: InsightInput): InsightResult {
    const lowSample = input.matches < 3;
    const confidence: ConfidenceLevel = lowSample
      ? "low"
      : input.matchedEntry
        ? "medium"
        : "low";
    const warning = lowSample
      ? "Low sample size may reduce reliability; consider expanding the match window."
      : null;
    const requiresFollowUp = confidence === "low";
    const followUps = [
      "Do you want this split by match state?",
      "Should I isolate the final 30 minutes?",
      "Do you want only in-possession sequences?",
    ];

    const baseAnswer = input.matchedEntry
      ? `${input.opponentId} show repeatable patterns around ${input.matchedEntry.term} across the last ${input.matches} matches.`
      : `The question needs tighter tactical framing to return a reliable result for ${input.opponentId}.`;
    const answer =
      input.audienceMode === "simplified"
        ? `${baseAnswer} Main coaching takeaway: use wide exits and quick third-man runs to break pressure.`
        : `${baseAnswer} Evidence indicates channel progression and pressure bypass actions are the strongest repeatable route.`;

    return {
      answer,
      confidence,
      warning,
      requiresFollowUp,
      followUps: followUps.slice(0, 3),
      widgets: defaultWidgets(
        input.matchedEntry?.widgetPreference ?? "pitch_zones",
      ),
      metadata: {
        competition: "Premier League",
        season: "2025/26",
        sampleSize: input.matches,
      },
    };
  }
}
