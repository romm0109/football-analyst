import { DashboardService } from "./dashboard.service";

interface DashboardBody {
  instruction?: string;
  minuteFrom?: number;
  minuteTo?: number;
  phase?: "in_possession" | "out_of_possession" | "transition" | "set_piece";
  widgetId?: string;
}

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  get(dashboardId: string): { statusCode: number; body: unknown } {
    const dashboard = this.dashboardService.get(dashboardId);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }

  edit(dashboardId: string, body: DashboardBody): { statusCode: number; body: unknown } {
    const dashboard = this.dashboardService.edit(dashboardId, body);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }

  patchFilters(dashboardId: string, body: DashboardBody): { statusCode: number; body: unknown } {
    const dashboard = this.dashboardService.edit(dashboardId, body);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }

  pin(dashboardId: string, body: DashboardBody): { statusCode: number; body: unknown } {
    if (!body.widgetId) {
      return { statusCode: 400, body: { error: "widget_id_required" } };
    }
    const dashboard = this.dashboardService.pin(dashboardId, body.widgetId, true);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }

  unpin(dashboardId: string, body: DashboardBody): { statusCode: number; body: unknown } {
    if (!body.widgetId) {
      return { statusCode: 400, body: { error: "widget_id_required" } };
    }
    const dashboard = this.dashboardService.pin(dashboardId, body.widgetId, false);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }

  undo(dashboardId: string): { statusCode: number; body: unknown } {
    const dashboard = this.dashboardService.undo(dashboardId);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }

  redo(dashboardId: string): { statusCode: number; body: unknown } {
    const dashboard = this.dashboardService.redo(dashboardId);
    if (!dashboard) {
      return { statusCode: 404, body: { error: "dashboard_not_found" } };
    }
    return { statusCode: 200, body: { dashboard } };
  }
}
