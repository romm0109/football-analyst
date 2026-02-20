import { ExportService } from "./export.service";

export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  pdf(
    sessionId: string | undefined,
    body: { dashboardId?: string; queryId?: string; includeNarrative?: boolean }
  ): { statusCode: number; body: unknown } {
    if (!sessionId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    if (!body.dashboardId || !body.queryId) {
      return { statusCode: 400, body: { error: "dashboard_id_and_query_id_required" } };
    }
    try {
      const exportResult = this.exportService.exportPdf({
        dashboardId: body.dashboardId,
        queryId: body.queryId,
        includeNarrative: body.includeNarrative ?? true
      });
      return { statusCode: 200, body: exportResult };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "export_failed";
      return { statusCode: 400, body: { error: reason } };
    }
  }
}
