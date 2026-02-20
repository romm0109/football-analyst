import { AudienceMode, QueryResponse } from "../../../../../libs/shared-types/src";
import { ContextService } from "../context/context.service";
import { DashboardRepository } from "../dashboard/dashboard.repository";
import { ObservabilityService } from "../observability/observability.service";
import { InsightService } from "./insight.service";
import { ParseService } from "./parse.service";
import { QueryRepository } from "./query.repository";

export interface QueryRequestBody {
  question: string;
  audienceMode?: AudienceMode;
}

export interface ClarifyRequestBody {
  answer: string;
}

export class QueryService {
  constructor(
    private readonly queryRepository: QueryRepository,
    private readonly contextService: ContextService,
    private readonly parseService: ParseService,
    private readonly insightService: InsightService,
    private readonly dashboardRepository: DashboardRepository,
    private readonly observabilityService: ObservabilityService
  ) {}

  async query(sessionId: string, body: QueryRequestBody): Promise<QueryResponse> {
    const startedAt = Date.now();
    const context = await this.contextService.get(sessionId);
    if (!context) {
      throw new Error("missing_context");
    }

    const parseStartedAt = Date.now();
    const parse = this.parseService.parse(body.question);
    this.observabilityService.recordStage("parse_ms", Date.now() - parseStartedAt);

    const queryRecord = this.queryRepository.create({
      sessionId,
      question: body.question,
      audienceMode: body.audienceMode ?? "technical",
      intent: parse.intent,
      pendingClarification: parse.intent.ambiguous
    });

    if (parse.intent.ambiguous) {
      const emptyDashboard = this.dashboardRepository.create({
        widgets: [],
        metadata: {
          competition: "Unknown",
          season: "Unknown",
          sampleSize: context.window.matches
        }
      });
      this.observabilityService.recordLatency("query_total_ms", Date.now() - startedAt);
      return {
        queryId: queryRecord.id,
        answer: "I need a clarification before running the analysis.",
        confidence: "low",
        warning: `Clarification needed: ${parse.intent.ambiguityReason ?? "unknown"}`,
        clarificationRequired: true,
        requiresFollowUp: true,
        followUps: [
          "Should the analysis focus on in-possession or out-of-possession?",
          "Do you want pressing behavior or chance creation patterns?"
        ],
        dashboardId: emptyDashboard.dashboardId,
        dashboardSpec: emptyDashboard,
        metadata: emptyDashboard.metadata
      };
    }

    const insightStartedAt = Date.now();
    const insight = this.insightService.build({
      teamId: context.teamId,
      opponentId: context.opponentId,
      question: body.question,
      audienceMode: body.audienceMode ?? "technical",
      matches: context.window.matches,
      matchedEntry: parse.matchedEntry
    });
    this.observabilityService.recordStage("insight_ms", Date.now() - insightStartedAt);

    const dashboardStartedAt = Date.now();
    const dashboard = this.dashboardRepository.create({
      widgets: insight.widgets,
      metadata: insight.metadata
    });
    this.observabilityService.recordStage("dashboard_spec_ms", Date.now() - dashboardStartedAt);
    this.observabilityService.recordLatency("query_total_ms", Date.now() - startedAt);

    return {
      queryId: queryRecord.id,
      answer: insight.answer,
      confidence: insight.confidence,
      warning: insight.warning,
      clarificationRequired: false,
      requiresFollowUp: insight.requiresFollowUp,
      followUps: insight.followUps,
      dashboardId: dashboard.dashboardId,
      dashboardSpec: dashboard,
      metadata: dashboard.metadata
    };
  }

  async clarify(sessionId: string, queryId: string, body: ClarifyRequestBody): Promise<QueryResponse> {
    const previous = this.queryRepository.findById(queryId);
    if (!previous || previous.sessionId !== sessionId) {
      throw new Error("query_not_found");
    }
    const mergedQuestion = `${previous.question}. Clarification: ${body.answer}`;
    const updated = this.queryRepository.update({
      ...previous,
      question: mergedQuestion,
      pendingClarification: false
    });
    return this.query(sessionId, {
      question: updated.question,
      audienceMode: updated.audienceMode
    });
  }
}
