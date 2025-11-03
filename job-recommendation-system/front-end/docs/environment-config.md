# Environment Configuration & API Routing Strategy

This project keeps the browser bundle agnostic of backend hostnames. Instead of
hard-coding `http://localhost:8000` (or any other service URL) in React
components, the frontend asks our own server for connection details at runtime.
This mirrors the pattern many backend services follow (for example, the
`ServerEnvironment` helper in our Java projects).

## Why we made this change

- **Single source of truth** – The backend already knows which environment it is
  running in. Let it decide the base API URL and environment flags instead of
  repeating that logic in the browser.
- **Safer redeployments** – Ops teams can point the proxy/gateway at a new
  backend target without rebuilding the frontend bundle.
- **Predictable local development** – Developers can still opt in to mocked APIs
  or localhost services, but that behaviour is switched on in one place.

## How it works

1. **Server-side resolver**  
   `lib/server/environment.ts` inspects environment variables
   (`API_BASE_URL`, `IS_LOCAL`, `NODE_ENV`, etc.) and returns an object that
   describes the current environment:
   ```ts
   {
     envName: 'DEVHF' | 'QA' | 'PROD' | 'LOCALHOST' | …,
     isProd: boolean,
     isLocal: boolean,
     apiBaseUrl: string,
   }
   ```

2. **API route exposure**  
   `pages/api/env-config.ts` exposes the resolver as `/api/env-config`.
   Any client (browser or server) can call this endpoint to discover the correct
   backend base URL.

3. **Runtime config loader**  
   `lib/runtimeConfig.ts` provides `getEnvironmentConfig()`, a cached helper that
   fetches `/api/env-config` on first use and shares the result with the rest of
   the app.

4. **Consumers**  
   Frontend code (for example `pages/auth/login.tsx` and `pages/auth/signup.tsx`)
   call `getEnvironmentConfig()` before making API requests:
   ```ts
   const { apiBaseUrl } = await getEnvironmentConfig();
   const response = await fetch(`${apiBaseUrl}/auth/login/email`, …);
   ```
   Network error messaging now references the resolved URL, so troubleshooting
   reflects the real target.

## Configuration

| Variable          | Purpose                                               | Typical value                      |
| ----------------- | ----------------------------------------------------- | ---------------------------------- |
| `API_BASE_URL`    | Real backend base URL (set per environment).          | `https://api.mycompany.com`        |
| `IS_LOCAL`        | Optional flag for local stacks that use mocks/localhost.| `true` in local `.env` files       |

If neither variable is set and we are running in development, the system falls
back to `http://localhost:8000`.

## Extending the pattern

- Add feature flags or mock toggles to the JSON returned by `/api/env-config`.
- Layer a reverse proxy in front of Next.js so all browser requests go through a
  same-origin `/api/*` path (this keeps CORS simple and centralises auth/rate
  limiting).
- If you need richer mocks, replace the real `fetch` in
  `lib/runtimeConfig.ts` when `isLocal` is true (e.g., use MSW handlers).

By keeping environment detection server-side and exposing it through a single
API endpoint, we align the frontend with the backend’s deployment knowledge and
avoid scattering infrastructure details throughout the UI.
