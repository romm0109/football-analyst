export interface IngestionJobStatus {
  id: string;
  runAt: string;
  status: "success" | "failed" | "running";
  recordsRead: number;
  recordsWritten: number;
  errorMessage: string | null;
}

export class IngestionService {
  private latest: IngestionJobStatus = {
    id: "job_bootstrap",
    runAt: new Date().toISOString(),
    status: "success",
    recordsRead: 0,
    recordsWritten: 0,
    errorMessage: null
  };

  setLatest(job: IngestionJobStatus): void {
    this.latest = job;
  }

  getLatest(): IngestionJobStatus {
    return this.latest;
  }
}
