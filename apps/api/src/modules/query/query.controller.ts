import { QueryService } from "./query.service";

export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  async query(
    sessionId: string | undefined,
    body: { question?: string; audienceMode?: "technical" | "simplified" }
  ): Promise<{ statusCode: number; body: unknown }> {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    if (!body.question) {
      return { statusCode: 400, body: { error: "question_required" } };
    }

    try {
      const result = await this.queryService.query(sessionId, {
        question: body.question,
        audienceMode: body.audienceMode
      });
      return { statusCode: 200, body: result };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "query_failed";
      return { statusCode: 400, body: { error: reason } };
    }
  }

  async clarify(
    sessionId: string | undefined,
    queryId: string,
    body: { answer?: string }
  ): Promise<{ statusCode: number; body: unknown }> {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    if (!body.answer) {
      return { statusCode: 400, body: { error: "answer_required" } };
    }
    try {
      const result = await this.queryService.clarify(sessionId, queryId, { answer: body.answer });
      return { statusCode: 200, body: result };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "clarification_failed";
      return { statusCode: 400, body: { error: reason } };
    }
  }
}
