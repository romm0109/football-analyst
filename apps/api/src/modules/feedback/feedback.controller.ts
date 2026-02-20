import { FeedbackService } from "./feedback.service";

export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  rating(
    sessionId: string | undefined,
    body: {
      queryId?: string;
      roleType?: "analyst" | "coach";
      score?: 1 | 2 | 3 | 4 | 5;
      comment?: string;
      userId?: string;
    }
  ): { statusCode: number; body: unknown } {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    if (!body.queryId || !body.roleType || !body.score) {
      return { statusCode: 400, body: { error: "query_id_role_type_score_required" } };
    }
    try {
      this.feedbackService.submit({
        userId: body.userId ?? sessionId,
        queryId: body.queryId,
        roleType: body.roleType,
        score: body.score,
        comment: body.comment
      });
      return { statusCode: 201, body: { ok: true } };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "feedback_failed";
      return { statusCode: 400, body: { error: reason } };
    }
  }

  summary(sessionId: string | undefined): { statusCode: number; body: unknown } {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    return {
      statusCode: 200,
      body: this.feedbackService.summary()
    };
  }
}
