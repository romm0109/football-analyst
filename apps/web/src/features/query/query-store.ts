import { AudienceMode, QueryResult } from "../../types/analysis";
import { DashboardStore } from "../dashboard/dashboard-store";
import { clarifyQuery, runQuery } from "./query-api";

type Listener = (state: QueryState) => void;

export interface QueryState {
  loading: boolean;
  current: QueryResult | null;
  error: string | null;
}

export class QueryStore {
  private state: QueryState = { loading: false, current: null, error: null };
  private readonly listeners = new Set<Listener>();

  constructor(private readonly dashboardStore: DashboardStore) {}

  getState(): QueryState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async run(question: string, audienceMode: AudienceMode): Promise<void> {
    this.setState({ ...this.state, loading: true, error: null });
    try {
      const result = await runQuery(question, audienceMode);
      this.dashboardStore.setDashboard(result.dashboardSpec);
      this.setState({ loading: false, current: result, error: null });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "query_failed";
      this.setState({ loading: false, current: null, error: reason });
    }
  }

  async clarify(answer: string): Promise<void> {
    const current = this.state.current;
    if (!current) {
      throw new Error("No query to clarify");
    }
    this.setState({ ...this.state, loading: true, error: null });
    try {
      const result = await clarifyQuery(current.queryId, answer);
      this.dashboardStore.setDashboard(result.dashboardSpec);
      this.setState({ loading: false, current: result, error: null });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "clarification_failed";
      this.setState({ loading: false, current: current, error: reason });
    }
  }

  private setState(next: QueryState): void {
    this.state = next;
    this.listeners.forEach((listener) => listener(this.state));
  }
}
