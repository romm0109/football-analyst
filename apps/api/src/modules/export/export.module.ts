import { DashboardService } from "../dashboard/dashboard.service";
import { ObservabilityService } from "../observability/observability.service";
import { ExportController } from "./export.controller";
import { ExportService } from "./export.service";

export interface ExportModule {
  exportService: ExportService;
  exportController: ExportController;
}

export function createExportModule(
  dashboardService: DashboardService,
  observabilityService: ObservabilityService
): ExportModule {
  const exportService = new ExportService(dashboardService, observabilityService);
  const exportController = new ExportController(exportService);
  return { exportService, exportController };
}
