# Auth Notes

## Local runtime

- Use `NODE_ENV=development`.
- For local HTTP, cookie `Secure` can be disabled by env-driven config.
- In staging/production, terminate TLS and keep `proxy: true` for secure cookie behavior behind reverse proxies.

## Public routes

- `GET /api/v1/auth/google/start`
- `GET /api/v1/auth/google/callback`

## Protected routes

- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- Any application data endpoints (for example `/api/v1/analysis`)
