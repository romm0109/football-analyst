import { buildGoogleStartUrl } from "./auth-api";

export function LoginPage(errorCode?: string): string {
  const errorNotice = errorCode ? `Sign-in failed: ${errorCode}` : "";
  return [
    "<main>",
    "<h1>Sign in</h1>",
    `<a href="${buildGoogleStartUrl()}">Continue with Google</a>`,
    `<p>${errorNotice}</p>`,
    "</main>"
  ].join("");
}
