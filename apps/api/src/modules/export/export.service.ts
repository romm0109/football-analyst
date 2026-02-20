import crypto from "node:crypto";
import { DashboardService } from "../dashboard/dashboard.service";
import { ObservabilityService } from "../observability/observability.service";

export interface ExportPdfInput {
  dashboardId: string;
  queryId: string;
  includeNarrative: boolean;
}

export interface ExportPdfResult {
  exportId: string;
  downloadUrl: string;
  pages: number;
}

export class ExportService {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly observabilityService: ObservabilityService
  ) {}

  exportPdf(input: ExportPdfInput): ExportPdfResult {
    const startedAt = Date.now();
    const dashboard = this.dashboardService.get(input.dashboardId);
    if (!dashboard) {
      throw new Error("dashboard_not_found");
    }

    const pages = Math.max(1, dashboard.widgets.length);
    const result: ExportPdfResult = {
      exportId: crypto.randomUUID(),
      downloadUrl: `/api/v1/export/pdf/${input.queryId}/${input.dashboardId}.pdf`,
      pages
    };
    this.observabilityService.recordLatency("export_total_ms", Date.now() - startedAt);
    return result;
  }
}
