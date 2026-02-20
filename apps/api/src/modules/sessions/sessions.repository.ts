import crypto from "node:crypto";

export interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
}

export interface CreateSessionInput {
  userId: string;
  ttlSeconds: number;
}

export class SessionsRepository {
  private readonly sessionsById = new Map<string, SessionRecord>();

  async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const now = new Date();
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      userId: input.userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + input.ttlSeconds * 1000),
      revokedAt: null
    };

    this.sessionsById.set(record.id, record);
    return record;
  }

  async revokeSession(sessionId: string, revokedAt = new Date()): Promise<boolean> {
    const record = this.sessionsById.get(sessionId);
    if (!record || record.revokedAt) {
      return false;
    }

    this.sessionsById.set(sessionId, { ...record, revokedAt });
    return true;
  }

  async findActiveSessionById(sessionId: string, now = new Date()): Promise<SessionRecord | null> {
    const record = this.sessionsById.get(sessionId);
    if (!record) {
      return null;
    }

    if (record.revokedAt) {
      return null;
    }

    if (record.expiresAt.getTime() <= now.getTime()) {
      return null;
    }

    return record;
  }
}
