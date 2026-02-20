import { DashboardSpec } from "../../types/analysis";
import {
  editDashboard,
  patchDashboardFilters,
  pinWidget,
  redoDashboard,
  undoDashboard,
  unpinWidget
} from "./dashboard-api";

type Listener = (dashboard: DashboardSpec | null) => void;

export class DashboardStore {
  private dashboard: DashboardSpec | null = null;
  private readonly listeners = new Set<Listener>();

  setDashboard(next: DashboardSpec): void {
    this.dashboard = next;
    this.emit();
  }

  getDashboard(): DashboardSpec | null {
    return this.dashboard;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async edit(instruction: string, minuteFrom?: number, minuteTo?: number): Promise<void> {
    if (!this.dashboard) {
      throw new Error("Dashboard not initialized");
    }
    this.dashboard = await editDashboard(this.dashboard.dashboardId, instruction, minuteFrom, minuteTo);
    this.emit();
  }

  async patchFilters(payload: {
    minuteFrom?: number;
    minuteTo?: number;
    phase?: DashboardSpec["widgets"][number]["filters"]["phase"];
  }): Promise<void> {
    if (!this.dashboard) {
      throw new Error("Dashboard not initialized");
    }
    this.dashboard = await patchDashboardFilters(this.dashboard.dashboardId, payload);
    this.emit();
  }

  async pin(widgetId: string): Promise<void> {
    if (!this.dashboard) {
      throw new Error("Dashboard not initialized");
    }
    this.dashboard = await pinWidget(this.dashboard.dashboardId, widgetId);
    this.emit();
  }

  async unpin(widgetId: string): Promise<void> {
    if (!this.dashboard) {
      throw new Error("Dashboard not initialized");
    }
    this.dashboard = await unpinWidget(this.dashboard.dashboardId, widgetId);
    this.emit();
  }

  async undo(): Promise<void> {
    if (!this.dashboard) {
      throw new Error("Dashboard not initialized");
    }
    this.dashboard = await undoDashboard(this.dashboard.dashboardId);
    this.emit();
  }

  async redo(): Promise<void> {
    if (!this.dashboard) {
      throw new Error("Dashboard not initialized");
    }
    this.dashboard = await redoDashboard(this.dashboard.dashboardId);
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.dashboard));
  }
}
