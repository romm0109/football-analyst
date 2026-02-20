import crypto from "node:crypto";
import {
  DashboardMetadata,
  DashboardSpec,
  DashboardWidget
} from "../../../../../libs/shared-types/src";

export interface DashboardRecord {
  dashboardId: string;
  versions: DashboardSpec[];
  cursor: number;
}

interface CreateDashboardInput {
  widgets: DashboardWidget[];
  metadata: DashboardMetadata;
}

export class DashboardRepository {
  private readonly dashboards = new Map<string, DashboardRecord>();

  create(input: CreateDashboardInput): DashboardSpec {
    const dashboardId = crypto.randomUUID();
    const first: DashboardSpec = {
      dashboardId,
      widgets: input.widgets,
      metadata: input.metadata,
      version: 1
    };
    this.dashboards.set(dashboardId, {
      dashboardId,
      versions: [first],
      cursor: 0
    });
    return first;
  }

  getCurrent(dashboardId: string): DashboardSpec | null {
    const record = this.dashboards.get(dashboardId);
    if (!record) {
      return null;
    }
    return record.versions[record.cursor] ?? null;
  }

  pushVersion(dashboardId: string, nextSpec: Omit<DashboardSpec, "version">): DashboardSpec | null {
    const record = this.dashboards.get(dashboardId);
    if (!record) {
      return null;
    }
    const previousVersion = record.versions[record.cursor];
    const nextVersionNumber = previousVersion.version + 1;
    const snapshot: DashboardSpec = { ...nextSpec, version: nextVersionNumber };
    record.versions = record.versions.slice(0, record.cursor + 1);
    record.versions.push(snapshot);
    record.cursor = record.versions.length - 1;
    return snapshot;
  }

  undo(dashboardId: string): DashboardSpec | null {
    const record = this.dashboards.get(dashboardId);
    if (!record) {
      return null;
    }
    record.cursor = Math.max(0, record.cursor - 1);
    return record.versions[record.cursor] ?? null;
  }

  redo(dashboardId: string): DashboardSpec | null {
    const record = this.dashboards.get(dashboardId);
    if (!record) {
      return null;
    }
    record.cursor = Math.min(record.versions.length - 1, record.cursor + 1);
    return record.versions[record.cursor] ?? null;
  }
}
