# Contributing Guidelines

Thanks for your interest in improving the Job Recommendation System! This guide explains how to get started, develop features, and submit changes.

## Getting Set Up
- Fork the repository and clone your fork locally.
- Install dependencies using either Docker (`docker compose up -d --build`) or the manual instructions from the README.
- Copy `.env.example` to `.env` (or `.env.local` for the frontend) and update credentials.
- Run `make up` or start the backend/frontend services individually to confirm everything works before you begin coding.

## Branching Model
- Create feature branches from `main` using a descriptive name, e.g. `feature/add-resume-parser`.
- Keep branches focused on a single concern; open additional branches for unrelated work.

## Coding Standards
- **Python**: follow PEP 8; run `python -m compileall core web` before pushing.
- **JavaScript/TypeScript**: adhere to the repository ESLint configuration; run `npm run lint` inside `job-recommendation-system/front-end`.
- **SQL**: include indexes and constraints; place schema/data changes in `job-recommendation-system/data/sql/Major_XX/`.
- **Docker**: favor multi-stage builds and minimal base images when updating containers.

## Testing & Verification
- Cover new features or fixes with unit/integration tests when feasible.
- Manually test critical user flows (sign-up, resume upload, Q&A submission, job recommendation) when they might be impacted.
- For database migrations, provide seed data or rollback instructions when appropriate.

## Commit & PR Checklist
- Sign every commit: `git commit -s` adds the required `Signed-off-by` trailer.
- Write clear messages describing what changed and why.
- Rebase onto the latest `main` before opening a PR to minimize merge conflicts.
- Confirm CI passes locally (linting, builds, migrations) where possible.
- Fill out the pull request template, reference related issues, and list any manual testing performed.

## Review Expectations
- Expect maintainers to review within a few business days; respond promptly to feedback.
- Address review comments with follow-up commits or rebase/amend if the changes are small.
- Maintainers may request additional tests or documentation updates prior to merge.

## Community Standards
- Treat other contributors respectfully; assume best intent.
- Report security vulnerabilities privately via the contact listed in the README.
- Use GitHub Issues for bugs and feature requests; include reproduction steps and environment details.

We appreciate your contributions—thank you for helping build a better job search experience!
