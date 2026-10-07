# Enhancement plan — research portfolio & content workspace

Goal: turn the current portfolio + admin CMS from a strong visual shell into a **complete, launch-ready, research-first portfolio** where (a) every public claim is admin-manageable, (b) nothing in the admin implies functionality that doesn't exist, and (c) the site is discoverable, accessible, and safe to deploy.

This plan is grounded in `docs/INCOMPLETE-TASKS.md`. Work top-down; each phase is independently shippable and ends with the project in a working state.

---

## Guiding principles

1. **Truthful UI.** If an admin control exists, it must affect the public site. Otherwise remove it.
2. **Evidence-first content.** The publication/project templates already model problem → gap → method → evidence → limitations. Finish exposing those fields.
3. **No invented claims.** Keep the `YOUR_*` placeholder discipline; never fabricate DOIs, venues, or metrics.
4. **One modular monolith, one Vercel deploy.** Preserve the current architecture; no new services unless measured.
5. **Every change keeps `typecheck`, `lint`, `test`, `build` green.**

---

## Phase 0 — Correctness & safety (P0, ~1–2 days)

> Do this first; it is small and unblocks trustworthy deployment.

### 0.1 Remove or implement dead verification scaffolding
- Delete empty dirs `src/app/admin/verify/` and `src/app/api/auth/verify-otp/` **unless** two-factor login is a requirement.
- If required, implement: `POST /api/auth/verify-otp` → store hashed single-use code on `Admin` (or a `LoginChallenge` model), send via Resend, complete `createSession` only after verification; add `src/app/admin/verify/page.tsx`.
- **Acceptance:** no empty route folders; `grep -r "verify-otp" src` resolves to a real handler or nothing.

### 0.2 Fix mojibake / encoding
- Replace `â€"`→`—`, `Â·`→`·`, `â€™`→`'` across `src/`. Affected files listed in `INCOMPLETE-TASKS.md §8.1`.
- Add `.editorconfig` with `charset = utf-8` and an ESLint rule / test guard that fails on mojibake sequences.
- **Acceptance:** a unit test asserts no source file contains `â€`, `Â·`, or `â€™`; visual spot-check of `/`, `/contact`, `/publications`, `/activities`.

### 0.3 Reproducible dependencies
- Replace `"latest"` in `package.json` with the resolved versions from `package-lock.json` (use `npm pkg set` or `npm install --save-exact <pkg>@<version>`).
- Add `.npmrc` with `save-exact=true`.
- **Acceptance:** clean `npm ci && npm run build` succeeds; `package.json` contains no `"latest"`.

### 0.4 Security headers
- Add `headers()` to `next.config.ts`: `Content-Security-Policy` (allow self, Cloudinary, Resend not needed client-side), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: SAMEORIGIN` (note `/cv` embeds a PDF iframe from `res.cloudinary.com` — allow that in CSP `frame-src`).
- **Acceptance:** headers present on a production build; `/cv` PDF preview still renders.

### 0.5 Documentation truth-up
- Update `README.md` and `ARCHITECTURE.md` to match reality after Phases 0–3 (no OTP, `next/image` scope, sections wiring, inbox).

---

## Phase 1 — Complete the content model (P1, ~1 week)

> This is the highest client-value work: make every published artifact maintainable from `/admin` without touching the database.

### 1.1 Extend the admin field system
`AdminField` currently supports only text/textarea/number/select/url/date/list/checkbox. Add:
- `metrics` — repeatable `{ label, value }` rows (`evaluationMetrics`).
- `media` — Cloudinary asset picker (reuse `CloudinaryUploader`, add a select-from-library mode).
- `relation` — multi-select referencing another `contentModels` collection.
- `tags`/`list` already exists; reuse for `dataset`, `models`, `researchAreas`.

Update `ContentManager.Editor` (`src/components/admin/content-manager.tsx`) to render the new types and serialize correctly. Mirror validation in `src/lib/validation/content.ts`.

### 1.2 Expose missing publication fields
Add to `adminModules.publications` (`src/config/admin-modules.ts`): `volume`, `issue`, `pageRange`, `dataset`, `models`, `evaluationMetrics` (metrics), `citationCount`, `thumbnail`/`graphicalAbstract`/`resultFigures` (media).
- **Acceptance:** create a publication entirely through the UI with metrics + a result figure; it renders on `/publications/[slug]`.

### 1.3 Expose missing project & record fields
- Projects: `motivation`, `evaluationMetrics` (metrics), `images`, `architectureDiagram`.
- Experience/Achievements/Activities: `certificate`, `image`, `logo` media fields; `relatedPublications`/`relatedProjects` relations on experience.

### 1.4 Content relations
- Add relation editors for `researchInterest.relatedPublications/Projects/Experience` and `experience.relatedPublications/Projects`.
- Surface them publicly: on `/research` link a direction to its papers/projects; on `/experience` link roles to outputs.
- **Acceptance:** linking a paper to a research direction changes the public research page.

### 1.5 Contact form hardening (verify only)
- The honeypot is already implemented (`website` hidden field + server short-circuit). Add a test asserting bot submissions return `{ received: true }` without creating a record.

---

## Phase 2 — Wire "Homepage sections" and settings (P1, ~3–4 days)

### 2.1 Section-driven homepage
- Add `getSiteSections()` to `src/services/public-content.ts` (cached, tag `sections`).
- In `src/app/page.tsx`, use each section's `heading`/`description`/`visibility`/`displayOrder`/`page` to drive the homepage blocks (`#selected-work`, achievements, academic overview, collaboration CTA) instead of hard-coded copy.
- Respect `visibility:false` and `publishState !== "published"` to hide blocks.
- **Acceptance:** editing a section heading in admin changes the homepage after revalidation; hiding a section removes it.

### 2.2 Statistics overrides
- Read `settings.statisticsOverrides` in the hero/stats so the client can correct counts without code changes; add settings fields for it.
- **Acceptance:** overriding "projects" count changes the hero.

### 2.3 Navigation from settings (optional)
- If the client wants editable nav, render `settings.navigation` in `site-header.tsx`; otherwise remove the unused field.

---

## Phase 3 — Admin completeness & content safety (P1, ~1 week)

### 3.1 Contact inbox
- Add `src/app/admin/inquiries/page.tsx` + `GET/PATCH/DELETE /api/admin/inquiries` (list, mark read/replied/archived, delete).
- Show `name`, `email`, `institution`, `inquiryType`, `message`, `deliveryStatus`, timestamps; reply via `mailto:` or a Resend reply endpoint.
- Add nav item in `admin-shell.tsx`.
- **Acceptance:** submitting `/contact` creates a record visible and actionable in the inbox.

### 3.2 Trash & restore
- Add `GET /api/admin/content/[module]/trash` and `POST /api/admin/content/[module]/[id]/restore` (clear `deletedAt`, set `publishState:"draft"`).
- Add a "Trash" view/filter in `ContentManager` with restore + permanent delete (owner only).
- **Acceptance:** deleting then restoring a record returns it to the public site when published.

### 3.3 Draft preview
- Add a signed preview route (`/preview/[module]/[id]`) gated by admin session; add a "Preview" action in `ContentManager`.
- **Acceptance:** drafts render through the real components without publishing.

### 3.4 Logout-all + account management
- Wire the existing `?all=true` logout in `admin-shell.tsx`.
- Add `src/app/admin/account/page.tsx` for password change and (owner only) admin listing/disable.

### 3.5 Audit log (P2, can slip)
- Add an `AuditLog` model capturing actor, module, record, action, diff summary; render a read-only admin list.

---

## Phase 4 — Discovery, SEO & accessibility (P1, ~4–5 days)

### 4.1 Metadata + structured data
- Give every public page `generateMetadata` with title, description, canonical, OpenGraph, Twitter.
- Add JSON-LD: `Person` (home/about), `ScholarlyArticle` (publication detail), `BreadcrumbList`, `ResearchProject`.
- **Acceptance:** Rich Results test recognizes `Person` and `ScholarlyArticle`.

### 4.2 Sitemap, robots, feed
- Add `src/app/sitemap.ts` (include published publications/projects/research), `src/app/robots.ts`, and an optional `src/app/publications/feed.xml/route.ts`.

### 4.3 Media & performance
- Use `next/image` for publication thumbnails/result figures/graphical abstracts and project images (Cloudinary is already in `remotePatterns`).
- Add route-level `loading.tsx` skeletons for `/`, `/publications`, `/projects`, `/research`.
- Consider streaming the homepage with `<Suspense>` boundaries per block.

### 4.4 Accessibility
- Add `@axe-core/playwright` and an e2e accessibility assertion per public route; keep reduced-motion and no-horizontal-overflow tests.
- Add an automated test for focus order in the mobile nav and the publication viewer.

---

## Phase 5 — Testing & delivery (P1/P2, ~1 week)

### 5.1 Test coverage
- Unit: admin content normalization for new field types, cache path mapping, rate limiting, auth token lifecycle, contact delivery fallbacks.
- Integration (Vitest + mongodb-memory-server or a test DB): full CRUD → cache invalidation → public service returns updated data.
- E2E: login → create draft → publish → public page reflects it; contact submit → inbox record.

### 5.2 CI
- Add a GitHub Actions workflow: install → `typecheck` → `lint` → `test` → `build`; optional Playwright job with the dev server.
- Add `verify:admin-api` coverage for `skill-categories` and the new inbox/restore endpoints.

### 5.3 Content audit
- Extend `scripts/audit-content.ts` to flag remaining `YOUR_*` placeholders, empty metrics, and optionally unreachable external URLs (HEAD with timeout).

---

## Phase 6 — Portfolio growth (client-facing differentiators)

> Optional, sequenced after the platform is trustworthy. These increase the portfolio's signal for PhD admissions and collaborators.

1. **Publication detail as evidence report** — surface metrics table, datasets/models, result figures, limitations, and BibTeX download consistently across index, featured stage, and detail.
2. **Research map storytelling** — make the existing `research-map.tsx` the primary `/research` navigator linking directions → papers → projects with the new relations from 1.4.
3. **Teaching & talks module** — new content module (schema + admin + public `/talks`) for lectures, posters, seminars.
4. **Grant/funding & service** — extend achievements or add a module for reviewing/committee service.
5. **Open-science artifacts** — surface code/dataset/DOI links with verified badges; add a "Reproducibility" block.
6. **Analytics-lite** — privacy-respecting page/outbound-link counters (no PII), stored in MongoDB, shown in the dashboard.
7. **Multilingual or research-only mode** — out of scope unless requested; document the decision.

---

## Priority matrix

| Phase | Theme | Severity | Impact | Effort |
|-------|-------|----------|--------|--------|
| 0 | Correctness & safety | P0 | Unblocks launch | Low |
| 1 | Complete content model | P1 | Highest client value | High |
| 2 | Wire sections/settings | P1 | Removes misleading UI | Medium |
| 3 | Admin completeness | P1 | Data becomes usable | High |
| 4 | SEO/a11y/perf | P1 | Discoverability, inclusion | Medium |
| 5 | Testing & CI | P1/P2 | Confidence, regressions | High |
| 6 | Portfolio growth | P2 | Differentiation | Ongoing |

---

## Definition of done (launch)

- [ ] No empty route folders; no `YOUR_*` placeholders in published records.
- [ ] Every admin control changes the public site (or is removed).
- [ ] Publications, projects, and records are fully creatable and editable end-to-end through `/admin`.
- [ ] Contact submissions are readable/actionable in an admin inbox.
- [ ] Soft-deleted items are restorable from the UI.
- [ ] Every public page has metadata + JSON-LD; sitemap and robots exist.
- [ ] `typecheck`, `lint`, `test`, `build`, and e2e all pass in CI.
- [ ] No `"latest"` dependency specifiers; security headers set.
- [ ] README/ARCHITECTURE match the shipped behavior.

---

## Suggested first sprint (concrete ticket list)

1. Delete or implement `admin/verify` + `api/auth/verify-otp`.
2. Fix mojibake + add encoding guard test.
3. Pin dependencies + `.npmrc`.
4. Add security headers (allow Cloudinary frame for `/cv`).
5. Add `metrics` field type + expose publication `evaluationMetrics`/`dataset`/`models` and project `metrics`.
6. Add `media` field type + expose publication figures and project images.
7. Add `getSiteSections()` and drive the homepage from it.
8. Add contact inbox (list + status update).
9. Add `sitemap.ts`, `robots.ts`, and per-page `generateMetadata`.
10. Add `loading.tsx` for the four heaviest public routes.
