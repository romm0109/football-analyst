# Football Analyst

## Authentication Setup (Google OAuth)

Required environment variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `WEB_BASE_URL`
- `SESSION_SECRET`
- `SESSION_TTL_SECONDS`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_DOMAIN`
- `SESSION_SAME_SITE`

Use `.env.example` as the template and keep secrets out of git.

Google OAuth console configuration:

- Authorized redirect URI must exactly match:
  - `http://localhost:3000/api/v1/auth/google/callback` (local)
  - Your production callback URI with HTTPS

Session requirements:

- Server-side session persistence only (no localStorage token storage)
- Cookie flags: `HttpOnly`, `Secure` outside local, explicit `SameSite`
- Logout must revoke session server-side and clear cookie

## Commands

- `npm run lint`
- `npm run typecheck`
- `npm run format:check`
- `npm run test -- apps/api`
- `npm run test -- apps/web`
- `npm run test:integration -- apps/api -- auth`
- `npm run e2e -- apps/web-e2e -- auth`
