import { DashboardSpec } from "../../../../../libs/shared-types/src";
import { DashboardRepository } from "./dashboard.repository";

export interface DashboardEditInput {
  instruction?: string;
  minuteFrom?: number;
  minuteTo?: number;
  phase?: "in_possession" | "out_of_possession" | "transition" | "set_piece";
}

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  get(dashboardId: string): DashboardSpec | null {
    return this.dashboardRepository.getCurrent(dashboardId);
  }

  edit(dashboardId: string, input: DashboardEditInput): DashboardSpec | null {
    const current = this.dashboardRepository.getCurrent(dashboardId);
    if (!current) {
      return null;
    }
    const pinnedIds = new Set(current.widgets.filter((widget) => widget.pinned).map((widget) => widget.id));
    const nextWidgets = current.widgets.map((widget) => {
      if (pinnedIds.has(widget.id)) {
        return widget;
      }
      return {
        ...widget,
        filters: {
          ...widget.filters,
          minuteFrom: input.minuteFrom ?? widget.filters.minuteFrom,
          minuteTo: input.minuteTo ?? widget.filters.minuteTo,
          phase: input.phase ?? widget.filters.phase
        }
      };
    });

    return this.dashboardRepository.pushVersion(dashboardId, {
      dashboardId: current.dashboardId,
      widgets: nextWidgets,
      metadata: current.metadata
    });
  }

  pin(dashboardId: string, widgetId: string, pinned: boolean): DashboardSpec | null {
    const current = this.dashboardRepository.getCurrent(dashboardId);
    if (!current) {
      return null;
    }
    const widgets = current.widgets.map((widget) =>
      widget.id === widgetId ? { ...widget, pinned } : widget
    );
    return this.dashboardRepository.pushVersion(dashboardId, {
      dashboardId: current.dashboardId,
      widgets,
      metadata: current.metadata
    });
  }

  undo(dashboardId: string): DashboardSpec | null {
    return this.dashboardRepository.undo(dashboardId);
  }

  redo(dashboardId: string): DashboardSpec | null {
    return this.dashboardRepository.redo(dashboardId);
  }
}
