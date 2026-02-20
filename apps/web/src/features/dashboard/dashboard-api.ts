import { DashboardSpec } from "../../types/analysis";

const API_BASE = "/api/v1/dashboard";

async function post(url: string, body: unknown): Promise<DashboardSpec> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error("Dashboard operation failed");
  }
  const data = (await response.json()) as { dashboard: DashboardSpec };
  return data.dashboard;
}

async function patch(url: string, body: unknown): Promise<DashboardSpec> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error("Dashboard update failed");
  }
  const data = (await response.json()) as { dashboard: DashboardSpec };
  return data.dashboard;
}

export async function editDashboard(
  dashboardId: string,
  instruction: string,
  minuteFrom?: number,
  minuteTo?: number
): Promise<DashboardSpec> {
  return post(`${API_BASE}/${dashboardId}/edit`, { instruction, minuteFrom, minuteTo });
}

export async function patchDashboardFilters(
  dashboardId: string,
  payload: { minuteFrom?: number; minuteTo?: number; phase?: DashboardSpec["widgets"][number]["filters"]["phase"] }
): Promise<DashboardSpec> {
  return patch(`${API_BASE}/${dashboardId}/filters`, payload);
}

export async function pinWidget(dashboardId: string, widgetId: string): Promise<DashboardSpec> {
  return post(`${API_BASE}/${dashboardId}/pin`, { widgetId });
}

export async function unpinWidget(dashboardId: string, widgetId: string): Promise<DashboardSpec> {
  return post(`${API_BASE}/${dashboardId}/unpin`, { widgetId });
}

export async function undoDashboard(dashboardId: string): Promise<DashboardSpec> {
  return post(`${API_BASE}/${dashboardId}/undo`, {});
}

export async function redoDashboard(dashboardId: string): Promise<DashboardSpec> {
  return post(`${API_BASE}/${dashboardId}/redo`, {});
}
