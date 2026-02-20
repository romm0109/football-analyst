import { AuthConfig } from "../../config/auth.config";
import { AuthService, GoogleProfilePayload } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";

export interface CookieWriter {
  set(name: string, value: string, options?: Record<string, unknown>): void;
  clear(name: string): void;
}

export interface AuthRequestContext {
  sessionId?: string;
  query?: Record<string, string | undefined>;
  profile?: Partial<GoogleProfilePayload>;
}

export interface RedirectResponse {
  redirectTo: string;
  statusCode: number;
}

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleStrategy: GoogleStrategy,
    private readonly config: AuthConfig
  ) {}

  start(): RedirectResponse {
    const { state } = this.authService.beginOAuthLogin();
    return {
      redirectTo: this.googleStrategy.getStartUrl(state),
      statusCode: 302
    };
  }

  async callback(context: AuthRequestContext, cookies: CookieWriter): Promise<RedirectResponse> {
    const state = context.query?.state;
    if (!state) {
      return { redirectTo: `${this.config.webBaseUrl}/login?error=state_mismatch`, statusCode: 302 };
    }

    try {
      this.authService.validateStateOrThrow(state);
      const profile = this.googleStrategy.toProfile({
        state,
        code: context.query?.code,
        profile: context.profile
      });
      const { session } = await this.authService.completeOAuthLogin(profile);
      cookies.set(this.config.sessionCookieName, session.id, {
        httpOnly: true,
        secure: this.config.cookieSecure,
        sameSite: this.config.sessionSameSite
      });
      return { redirectTo: `${this.config.webBaseUrl}/app`, statusCode: 302 };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "oauth_failed";
      return { redirectTo: `${this.config.webBaseUrl}/login?error=${reason}`, statusCode: 302 };
    }
  }

  async me(context: AuthRequestContext): Promise<{ statusCode: number; body: unknown }> {
    const me = await this.authService.getMe(context.sessionId);
    if (!me) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }
    return {
      statusCode: 200,
      body: {
        user: {
          id: me.user.id,
          email: me.user.email,
          name: me.user.name
        },
        session: {
          id: me.session.id,
          expiresAt: me.session.expiresAt.toISOString()
        }
      }
    };
  }

  async logout(context: AuthRequestContext, cookies: CookieWriter): Promise<{ statusCode: number }> {
    await this.authService.logout(context.sessionId);
    cookies.clear(this.config.sessionCookieName);
    return { statusCode: 204 };
  }
}
