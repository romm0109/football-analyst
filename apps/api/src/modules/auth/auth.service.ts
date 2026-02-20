import crypto from "node:crypto";
import { AuthConfig } from "../../config/auth.config";
import { SessionRecord, SessionsRepository } from "../sessions/sessions.repository";
import { UserRecord } from "../users/users.repository";
import { UsersService } from "../users/users.service";

export interface GoogleProfilePayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthenticatedSession {
  session: SessionRecord;
  user: UserRecord;
}

interface OAuthStateRecord {
  value: string;
  expiresAt: number;
}

export class AuthService {
  private readonly oauthStateStore = new Map<string, OAuthStateRecord>();

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsRepository: SessionsRepository,
    private readonly authConfig: AuthConfig
  ) {}

  beginOAuthLogin(): { state: string; redirectUrl: string } {
    const state = crypto.randomUUID();
    this.oauthStateStore.set(state, {
      value: state,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    const query = new URLSearchParams({
      client_id: this.authConfig.googleClientId,
      redirect_uri: this.authConfig.googleCallbackUrl,
      response_type: "code",
      scope: "openid profile email",
      state
    });

    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${query.toString()}`;
    this.log("login_start", { provider: "google" });

    return { state, redirectUrl };
  }

  validateStateOrThrow(state: string): void {
    const record = this.oauthStateStore.get(state);
    if (!record || record.expiresAt < Date.now()) {
      this.log("login_failure", { reason: "state_mismatch" });
      throw new Error("state_mismatch");
    }
    this.oauthStateStore.delete(state);
  }

  async completeOAuthLogin(profile: GoogleProfilePayload): Promise<AuthenticatedSession> {
    if (!profile.sub || !profile.email) {
      this.log("login_failure", { reason: "oauth_failed" });
      throw new Error("oauth_failed");
    }

    const user = await this.usersService.upsertGoogleUser({
      googleSub: profile.sub,
      email: profile.email,
      name: profile.name || profile.email
    });
    const session = await this.sessionsRepository.createSession({
      userId: user.id,
      ttlSeconds: this.authConfig.sessionTtlSeconds
    });

    this.log("login_success", { userId: user.id });
    return { user, session };
  }

  async getMe(sessionId: string | undefined): Promise<AuthenticatedSession | null> {
    if (!sessionId) {
      return null;
    }
    const session = await this.sessionsRepository.findActiveSessionById(sessionId);
    if (!session) {
      return null;
    }

    const user = await this.findUserById(session.userId);
    if (!user) {
      return null;
    }

    return { user, session };
  }

  async logout(sessionId: string | undefined): Promise<boolean> {
    if (!sessionId) {
      return false;
    }
    const revoked = await this.sessionsRepository.revokeSession(sessionId);
    this.log(revoked ? "session_revoked" : "logout", { revoked });
    return revoked;
  }

  private async findUserById(userId: string): Promise<UserRecord | null> {
    return this.usersService.findById(userId);
  }

  private log(event: string, details: Record<string, unknown>): void {
    console.info(JSON.stringify({ event, ...details }));
  }
}
