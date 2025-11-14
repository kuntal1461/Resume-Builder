# LaTeX Renderer Service

Standalone REST API that accepts LaTeX resume payloads, compiles them with `latexmk`, and returns PDFs plus preview metadata for the Resume Builder platform.

---

## Architecture

```
HTTP client ──> Express app (src/app.ts)
                  │
                  ├─► Validation (Zod schema in render.router.ts)
                  │
                  └─► RenderService (render.service.ts)
                       ├─► compileLatexToPdf (latexCompiler.ts)
                       │      • writes temp main.tex
                       │      • invokes latexmk -pdf (timeout+log capture)
                       │      • reads main.pdf buffer
                       └─► buildPreviewMetadata (pdfPreview.ts)
                              • sanitize tokens + excerpt

Cross-cutting:
  • Config/env parsing (src/config/env.ts)
  • Structured logging (src/infra/logger.ts with Pino)
  • Health checks + CORS/Helmet middleware (src/app.ts)
```

- **Entry point (`src/main.ts`)**: loads env, boots Express via `createApp()`, and starts listening with Pino logging so container/runtime can manage the process.
- **HTTP layer (`src/app.ts`)**: applies Helmet, JSON limits, and dynamic CORS (based on `ALLOWED_ORIGINS`). Routes:
  - `GET /healthz` for uptime probes.
  - `POST /render` handled by the render module.
  - Terminal error handler to ensure every unhandled exception becomes a logged 500.
- **Render module**:
  - `render.router.ts` owns request validation (Zod) and translates transport errors → HTTP responses.
  - `render.service.ts` orchestrates rendering and metadata assembly, returning `{ pdfDataUrl, excerpt, tokens, log }`.
  - `latexCompiler.ts` encapsulates filesystem + `latexmk` process management (temp dir per request, timeout, cleanup).
  - `pdfPreview.ts` extracts a human-readable excerpt from the LaTeX body and hydrates/sanitizes personalization tokens.
- **Configuration (`src/config/env.ts`)**: central place for port/log-level/origin parsing with sane defaults to keep other modules pure.
- **Logging (`src/infra/logger.ts`)**: Pino instance with pretty transport during development; imported wherever structured logs are needed.

The service remains stateless—every request writes to an isolated temp directory, so horizontal scaling is as simple as adding replicas with `latexmk` installed.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the service with `ts-node` for local development. |
| `npm run build` | Compile TypeScript to `dist/` (includes `.d.ts` for consumers). |
| `npm start` | Start the compiled service from `dist/main.js`. |
| `npm run lint` | Lint the TypeScript sources with ESLint. |

---

## Requirements

- `latexmk` + a TeX Live distribution available on the `$PATH`. The Docker image installs `texlive-full`, but for local development you can install TeX Live or Tectonic manually. Requests fail fast with a clear error if `latexmk` is missing.

---

## REST API

`POST /render`

```json
{
  "latexSource": "....",
  "templateName": "AI Researcher Sprint",
  "tokens": {
    "candidate": "Elena Kapoor",
    "role": "LLM Operations Lead",
    "workspace": "Velocity Pod · SF"
  }
}
```

Response:

```json
{
  "pdfDataUrl": "data:application/pdf;base64,....",
  "excerpt": "Resume preview rendered ...",
  "tokens": {
    "candidate": "Elena Kapoor",
    "role": "LLM Operations Lead",
    "workspace": "Velocity Pod · SF"
  },
  "log": "latexmk output..."
}
```

The service compiles the LaTeX source with `latexmk -pdf` and returns the generated PDF as a data URL along with an excerpt + hydrated token metadata. Errors are surfaced as `{ "error": "…message…" }` with 4xx for validation failures and 5xx for render problems.

---

## Next steps

1. Persist render metadata to Postgres/Redis and store PDFs in object storage.
2. Add a queue/worker tier for high-volume rendering or long-running templates.
3. Layer in authentication/rate limiting ahead of the `/render` route for multitenant deployments.
