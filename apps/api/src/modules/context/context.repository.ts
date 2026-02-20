import { AnalysisWindow, TeamContext } from "../../../../../libs/shared-types/src";

export interface ContextRecord extends TeamContext {
  sessionId: string;
  updatedAt: Date;
}

export class ContextRepository {
  private readonly records = new Map<string, ContextRecord>();

  async upsert(sessionId: string, context: TeamContext): Promise<ContextRecord> {
    const record: ContextRecord = {
      sessionId,
      teamId: context.teamId,
      opponentId: context.opponentId,
      window: context.window,
      updatedAt: new Date()
    };
    this.records.set(sessionId, record);
    return record;
  }

  async findBySessionId(sessionId: string): Promise<ContextRecord | null> {
    return this.records.get(sessionId) ?? null;
  }
}

export function defaultAnalysisWindow(): AnalysisWindow {
  return { matches: 5 };
}
