import { AuthConfig } from "../../../config/auth.config";
import { GoogleProfilePayload } from "../auth.service";

export interface GoogleOAuthCallbackInput {
  code?: string;
  state?: string;
  profile?: Partial<GoogleProfilePayload>;
}

export class GoogleStrategy {
  constructor(private readonly authConfig: AuthConfig) {}

  getStartUrl(state: string): string {
    const query = new URLSearchParams({
      client_id: this.authConfig.googleClientId,
      redirect_uri: this.authConfig.googleCallbackUrl,
      response_type: "code",
      scope: "openid profile email",
      state
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${query.toString()}`;
  }

  toProfile(input: GoogleOAuthCallbackInput): GoogleProfilePayload {
    const sub = input.profile?.sub?.trim();
    const email = input.profile?.email?.trim();
    const name = input.profile?.name?.trim() ?? email ?? "";

    if (!input.state) {
      throw new Error("state_mismatch");
    }
    if (!sub || !email) {
      throw new Error("oauth_failed");
    }

    return { sub, email, name };
  }
}
