import { IngestionService } from "./ingestion.service";

export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  health(sessionId: string | undefined): { statusCode: number; body: unknown } {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    return { statusCode: 200, body: { latestJob: this.ingestionService.getLatest() } };
  }
}
