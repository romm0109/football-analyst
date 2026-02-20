import { TeamContext } from "../../../../../libs/shared-types/src";
import { ContextService } from "./context.service";

export interface ContextRequestBody extends Partial<TeamContext> {}

export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  async save(
    sessionId: string | undefined,
    body: ContextRequestBody
  ): Promise<{ statusCode: number; body: unknown }> {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    try {
      const context = await this.contextService.save(sessionId, body);
      return { statusCode: 200, body: { context } };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "invalid_context";
      return { statusCode: 400, body: { error: reason } };
    }
  }

  async get(sessionId: string | undefined): Promise<{ statusCode: number; body: unknown }> {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    const context = await this.contextService.get(sessionId);
    if (!context) {
      return { statusCode: 404, body: { error: "context_not_found" } };
    }
    return { statusCode: 200, body: { context } };
  }
}
