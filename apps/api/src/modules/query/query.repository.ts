import crypto from "node:crypto";
import { AudienceMode, QueryIntent } from "../../../../../libs/shared-types/src";

export interface QueryRecord {
  id: string;
  sessionId: string;
  question: string;
  audienceMode: AudienceMode;
  intent: QueryIntent | null;
  pendingClarification: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class QueryRepository {
  private readonly queries = new Map<string, QueryRecord>();

  create(input: {
    sessionId: string;
    question: string;
    audienceMode: AudienceMode;
    intent: QueryIntent | null;
    pendingClarification: boolean;
  }): QueryRecord {
    const now = new Date();
    const record: QueryRecord = {
      id: crypto.randomUUID(),
      sessionId: input.sessionId,
      question: input.question,
      audienceMode: input.audienceMode,
      intent: input.intent,
      pendingClarification: input.pendingClarification,
      createdAt: now,
      updatedAt: now
    };
    this.queries.set(record.id, record);
    return record;
  }

  findById(id: string): QueryRecord | null {
    return this.queries.get(id) ?? null;
  }

  update(record: QueryRecord): QueryRecord {
    const updated: QueryRecord = { ...record, updatedAt: new Date() };
    this.queries.set(record.id, updated);
    return updated;
  }
}
