export interface MetricPoint {
  name: string;
  value: number;
  at: string;
}

export class ObservabilityService {
  private readonly latency: MetricPoint[] = [];
  private readonly stageTimings: MetricPoint[] = [];

  recordLatency(name: string, value: number): void {
    this.latency.push({ name, value, at: new Date().toISOString() });
  }

  recordStage(name: string, value: number): void {
    this.stageTimings.push({ name, value, at: new Date().toISOString() });
  }

  summary(): {
    latency: MetricPoint[];
    stageTimings: MetricPoint[];
    p50QueryMs: number;
    p95QueryMs: number;
  } {
    const queryLatencies = this.latency.filter((point) => point.name === "query_total_ms").map((p) => p.value);
    const ordered = [...queryLatencies].sort((a, b) => a - b);
    const p50Index = ordered.length ? Math.floor((ordered.length - 1) * 0.5) : 0;
    const p95Index = ordered.length ? Math.floor((ordered.length - 1) * 0.95) : 0;
    return {
      latency: this.latency,
      stageTimings: this.stageTimings,
      p50QueryMs: ordered[p50Index] ?? 0,
      p95QueryMs: ordered[p95Index] ?? 0
    };
  }
}
