# Resume Admin Dashboard Architecture

This sub-application powers the internal experience used to curate resume templates. It shares the monorepo with the recommendation platform, but has its own stack and architecture decisions so admins can safely create and iterate on LaTeX templates.

## High-Level Components

| Layer | Responsibility | Key Modules |
| --- | --- | --- |
| Database | Persists template metadata + every LaTeX version. | `data/sql/Major_01_00_00/*.sql` |
| ORM Entities | SQLAlchemy models that expose soft-delete + audit fields. | `core/entity/*.py`, `backend-common/orm/common.py` |
| Repository + Service layer | Encapsulates queries and business rules (validation, transactions). | `core/repository`, `core/serviceImpl` |
| FastAPI controllers | HTTP contract for templates, categories, versions. | `web/restController/*.py` |
| Next.js API routes | Frontend-friendly proxy that resolves env vars and handles cookies. | `frontend/pages/api/templates/*` |
| React/Next.js pages | Admin UI (template queue, saved space, LaTeX editor). | `frontend/pages/view/templates/*` |

## Data Model

- `resume_template`: immutable template identity (owner, category, status, flags). Every edit keeps the same ID.
- `resume_template_version`: child table storing LaTeX source + changelog. Each save appends a new record (`resume_template` → `resume_template_version` is `1:N`).

Audit fields such as `loggedBy`, `lastUpdatedBy`, `loggedInTime`, and `lastUpdateTime` are enforced through the shared `BaseEntityMixin`.

## Service Workflow

1. **Create template**
   - `POST /templates` → `ResumeTemplateServiceImpl.create_template`.
   - Validates parent/child categories, owner activity, and status.
   - Inserts into `resume_template`, immediately appends version row, commits in a single transaction.

2. **Update template**
   - `PUT /templates/{id}` → `ResumeTemplateServiceImpl.update_template`.
   - Updates parent row (title, category, status, audit fields) and appends a version row using the requested version label/number. No duplicate template IDs are produced.

3. **Version history**
   - `GET /templates/{id}/versions` returns lightweight summaries (`id`, `version_no`, label, timestamps) using `ResumeTemplateVersionRepository.list_by_template_id`.

4. **Listing by status**
   - `GET /templates?status=draft|published|archive` surfaces summary cards with the latest update timestamp for queue dashboards.

## Frontend Flow

### Next.js API Proxy

- All admin pages call `/api/templates/*` routes under `frontend/pages/api`.  
- These proxy to FastAPI via `frontend/lib/server/resumeTemplates.ts`, reusing the same environment resolution helper so deployments only configure base URLs in one place.

### LaTeX Upload (`view/templates/latex-upload.tsx`)

1. When `templateId` is present in the query string, the page loads `GET /api/templates/{id}`, hydrates the form, and stores `activeTemplateId`.
2. On save:
   - If `activeTemplateId` is `null` → `POST /api/templates` (creates new template + first version).
   - If not → `PUT /api/templates/{id}` (updates existing template and creates the next version).
3. The version number is derived from the label (`_derive_version_number`) to ensure numeric ordering.

### Queue (`view/templates/queue.tsx`)

- Fetches draft templates via `/api/templates?status=draft`.
- Shows KPIs (total drafts, updated last 24h, needs assignment) using service timestamps.
- Each card includes a **version dropdown**:
  - On focus/hover the page calls `/api/templates/{id}/versions`.
  - Versions are cached per template to avoid repeat calls and rendered with human-friendly labels.

### Saved Templates (`view/templates/saved.tsx`)

- Mirrors the queue layout but filters for published/archive states.
- Uses the same hero + panel styling to keep admin surfaces consistent.

## Why This Architecture?

- **Data integrity**: separating template metadata from versions avoids accidental duplication when editing and provides a complete audit trail.
- **Transactional safety**: SQLAlchemy services wrap parent + version writes in one session/commit, guaranteeing the tables never drift out of sync.
- **UI flexibility**: Next.js API routes hide backend URLs and allow incremental adoption of SSR/ISR without touching FastAPI contracts.
- **Performance**: template listings stay lightweight (just metadata + last update), while version histories are lazily fetched per template to reduce load under heavy queues.
- **Maintainability**: clear directories (`core`, `web`, `frontend`) let teams evolve backend and frontend independently while sharing typed request/response objects.

Use this README as the reference point when onboarding contributors or planning further enhancements (e.g., diffing versions, approvals, bulk actions). The current architecture supports those extensions without changes to the core data model.
