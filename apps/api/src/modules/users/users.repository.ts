import crypto from "node:crypto";

export interface UserRecord {
  id: string;
  googleSub: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertUserInput {
  googleSub: string;
  email: string;
  name: string;
}

export class UsersRepository {
  private readonly usersByGoogleSub = new Map<string, UserRecord>();
  private readonly usersById = new Map<string, UserRecord>();

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    return this.usersByGoogleSub.get(googleSub) ?? null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.usersById.get(id) ?? null;
  }

  async upsertByGoogleSub(input: UpsertUserInput): Promise<UserRecord> {
    const now = new Date();
    const existing = await this.findByGoogleSub(input.googleSub);

    if (existing) {
      const updated: UserRecord = {
        ...existing,
        email: input.email,
        name: input.name,
        updatedAt: now
      };
      this.usersByGoogleSub.set(input.googleSub, updated);
      this.usersById.set(existing.id, updated);
      return updated;
    }

    const created: UserRecord = {
      id: crypto.randomUUID(),
      googleSub: input.googleSub,
      email: input.email,
      name: input.name,
      createdAt: now,
      updatedAt: now
    };
    this.usersByGoogleSub.set(input.googleSub, created);
    this.usersById.set(created.id, created);
    return created;
  }
}
