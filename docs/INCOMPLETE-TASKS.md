# Incomplete tasks, dead code, and known gaps

Audit of the current `research-field-notes` codebase. Each item cites the file that proves it.
Severity: **P0** = correctness, security, or launch blocker · **P1** = incomplete feature the UI implies works · **P2** = polish / growth.

Legend for status: `DEAD` = scaffolding with no consumer · `PARTIAL` = built but not reachable/complete · `MISSING` = expected but absent.

---

## 1. Dead / empty scaffolding

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 1.1 | P0 | DEAD | `src/app/admin/verify/` is an **empty directory** — no `page.tsx`, yet the route namespace exists. | `src/app/admin/verify` (0 entries) |
| 1.2 | P0 | DEAD | `src/app/api/auth/verify-otp/` is an **empty directory** — no `route.ts`. No OTP/step-up verification is implemented anywhere; the only match for `otp` in the codebase is this folder name. | `src/app/api/auth/verify-otp` (0 entries) |
| 1.3 | P1 | MISSING | The admin has no UI for the existing `?all=true` "logout all sessions" API branch. | API: `src/app/api/auth/logout/route.ts:5`; no caller in `src/components/admin/admin-shell.tsx` |
| 1.4 | P1 | MISSING | No admin account management (list/create/disable owner vs editor, change own password). `role` exists but is unused in UI. | `adminSchema` in `src/models/index.ts:12`; no route/page |

**Recommendation:** delete 1.1 and 1.2 if OTP is not a real requirement, or implement them (1.1 depends on 1.2). Keeping empty route folders is confusing and `notFound()`-prone.

---

## 2. "Homepage sections" module is not wired to the public site

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 2.1 | P1 | PARTIAL | `sections` is fully manageable in admin (heading, description, page, visibility, displayOrder, publish state), cached-tag registered, and path-mapped — but **no public service or component ever reads `SiteSection`**. Editing a section changes nothing on the site. | Model: `src/models/index.ts:15`; config: `src/config/admin-modules.ts:137`; cache map: `src/lib/cache/content-cache.ts:6`; grep shows `SiteSection` referenced only in `models/index.ts` |
| 2.2 | P1 | MISSING | `settings.statisticsOverrides` is defined in the schema but never read or written. | `src/models/index.ts:14` |
| 2.3 | P2 | MISSING | `settings.navigation` is defined but the header/footer never consume it; nav is hard-coded. | `src/models/index.ts:14`, `src/components/layout/site-header.tsx` |

**Recommendation:** either (a) add `getSiteSections()` to `src/services/public-content.ts` and use heading/description/visibility/order to drive the homepage `#selected-work` and other homepage blocks, or (b) remove the module to avoid a misleading admin screen. Option (a) is the client-visible win.

---

## 3. Schema fields with no admin editor (content can't be maintained)

These fields exist in Mongoose/public view models and are rendered on public pages, but there is **no field in `admin-modules.ts`**, so they can only be set by editing the database or calling the API directly.

### Publications
| Field | Schema | Public use |
|-------|--------|-----------|
| `volume`, `issue`, `pageRange` | `src/models/index.ts:19` | bibliographic citation |
| `dataset` (list) | `src/models/index.ts:19` | shown in research detail |
| `models` (list) | `src/models/index.ts:19` | shown in research detail |
| `evaluationMetrics` (array of `{label,value}`) | `src/models/index.ts:19` | mapped to `metrics` in `src/services/public-content.ts:23` |
| `citationCount` | `src/models/index.ts:19` | `citationCount` in `public-content.ts:23` |
| `thumbnail`, `graphicalAbstract`, `resultFigures` | `src/models/index.ts:19` | media evidence — **no admin/media picker** |
| `correspondingAuthor` | present in config (`admin-modules.ts:31`) | OK |
| `publicationYear`/`publicationDate` | present | OK |

The admin field type system (`AdminField`) also has **no `metrics` / media / relation** editor, so even adding names wouldn't be enough — a structured field type is required. See `src/config/admin-modules.ts:1`.

### Projects
| Field | Evidence |
|-------|----------|
| `motivation` | `src/models/index.ts:22` |
| `evaluationMetrics` → `metrics` | `src/models/index.ts:22`, `public-content.ts:35` |
| `images`, `architectureDiagram` | `src/models/index.ts:22` — no media picker |

### Relations
| Field | Evidence |
|-------|----------|
| `researchInterest.relatedPublications`, `relatedProjects`, `relatedExperience` | `src/models/index.ts:16` — never surfaced or editable |
| `experience.relatedPublications`, `relatedProjects` | `src/models/index.ts:25` |
| `experience.certificate`, `logo`; `achievement.certificate`, `image`; `activity.image`, `certificate` | schemas exist, no media field in admin, not shown publicly |

**Recommendation:** add structured admin field types (`metrics`, `media`, `relation`, `tags`) and expose the fields above. This is the largest *content-completeness* gap for a research portfolio.

---

## 4. Contact / inquiry management

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 4.1 | P1 | MISSING | Inquiries are **stored** in `ContactMessage` with `status` (`new/read/replied/archived`) and `deliveryStatus`, but there is **no admin inbox** to read, reply-to, or archive them. Data is write-only. | `src/models/index.ts:32`; `src/app/api/contact/route.ts:19`; no route/UI referencing `ContactMessage` beyond the write |
| 4.2 | P2 | PARTIAL | Contact rate limiting is in-memory per process; on serverless it resets per instance and is not shared. | `src/lib/security/rate-limit.ts:1` |
| 4.3 | — | OK | Honeypot is implemented: hidden `website` field is rendered and silently short-circuited server-side. No action needed. | `src/components/contact/contact-form.tsx:19`, `src/app/api/contact/route.ts:17`, `src/lib/validation/contact.ts` |

---

## 5. Recovery, revision, and audit

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 5.1 | P1 | PARTIAL | Deletion is a soft delete (`deletedAt`, `visibility:false`, `publishState:"archived"`), but there is **no restore endpoint and no Trash/admin view**. "Recoverable" only in the database. | `src/app/api/admin/content/[module]/[id]/route.ts:42-49`; no restore route (`api/admin/content` has only `route.ts` and `[id]/route.ts`) |
| 5.2 | P2 | MISSING | No revision history / audit log for content changes. | no model; content writes are direct updates |
| 5.3 | P2 | MISSING | No "preview draft as public" flow; previewing requires publishing. | `ContentManager` has no preview action (`src/components/admin/content-manager.tsx`) |

---

## 6. SEO, discoverability, and metadata

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 6.1 | P1 | MISSING | No `sitemap.ts` / `robots.ts`. | grep: none in `src/app` |
| 6.2 | P1 | MISSING | No structured data (`schema.org` `Person`, `ScholarlyArticle`, `BreadcrumbList`). Critical for an academic portfolio. | grep: no `application/ld+json` |
| 6.3 | P1 | PARTIAL | Only the root layout and publication detail define metadata. Research/projects/about/cv have **title only**, no `description`, OpenGraph, or canonical. | `src/app/layout.tsx:8`; `src/app/publications/[slug]/page.tsx:7`; other pages define `{ title }` only |
| 6.4 | P2 | MISSING | No OpenGraph/Twitter image, favicon, manifest, or apple icons. | grep: no `opengraph-image`, `icon`, `manifest` |
| 6.5 | P2 | MISSING | No RSS/Atom feed for publications. | — |

---

## 7. Performance and UX

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 7.1 | P1 | PARTIAL | `next/image` is used **only for the portrait**. Publication/media assets are plain URLs in the new-media spot; README claims "Next Image negotiates AVIF/WebP" but most media bypasses it. | `src/components/home/profile-showcase.tsx:97`; grep shows no other `next/image` |
| 7.2 | P1 | MISSING | No route-level `loading.tsx` / skeletons for public pages; all homepage data is awaited in one blocking `Promise.all`. | `src/app/page.tsx:16`; no `loading.tsx` under `src/app` |
| 7.3 | P2 | MISSING | No `error.tsx` / `not-found.tsx` per section beyond the global ones. | only `src/app/error.tsx`, `src/app/not-found.tsx` |
| 7.4 | P2 | PARTIAL | Reduced-motion is handled, but there is no automated accessibility (axe) check. | e2e has manual overflow/keyboard checks only |

---

## 8. Correctness, encoding, and build hygiene

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 8.1 | P0 | BUG | **Mojibake / UTF-8 double-encoding** in shipped source: `â€”` (em dash), `Â·` (middot), `â€™` (apostrophe). Renders incorrectly to users. | `src/app/layout.tsx:10-11`; `src/app/contact/page.tsx:23`; `src/app/activities/page.tsx:5`; `src/app/achievements/page.tsx:5`; `src/app/skills/page.tsx:52`; `src/components/publications/publication-index-hero.tsx:13,22`; `src/components/home/home-overview.tsx:30`; `src/lib/placeholder-data.ts:5,119` |
| 8.2 | P0 | RISK | **Every dependency is pinned to `"latest"`** (`next`, `react`, `mongodb` etc.). Non-reproducible builds; a breaking major can land on any install/deploy. `package-lock.json` mitigates locally but not on a clean policy. | `package.json:20-61` |
| 8.3 | P1 | MISSING | No security headers (CSP, HSTS, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy) in `next.config.ts`. | `next.config.ts:3` |
| 8.4 | P2 | PARTIAL | `middleware.ts` trusts the JWT signature and does **not** check `sessionVersion`/`active`; only `getSession({checkDatabase:true})` in APIs does. Fine for APIs, but edge gating is weaker than documented. | `middleware.ts:4`, `src/lib/auth/session.ts:13` |
| 8.5 | P2 | MISSING | `npm run verify:admin-api` does not cover the `skill-categories` module. | `scripts/verify-admin-api.ts:4` |
| 8.6 | P2 | MISSING | `audit-content` checks slugs/DOIs but not remaining `YOUR_*` placeholders or broken external links. | `scripts/audit-content.ts` |
| 8.7 | P2 | PARTIAL | Cloudinary uploader does not persist `activeCv` validation or delete superseded versions; README describes version-replacement discipline not enforced by code. | `src/components/admin/cloudinary-uploader.tsx:29-32` |

---

## 9. Testing gaps

| # | Sev | Status | Finding | Evidence |
|---|-----|--------|---------|----------|
| 9.1 | P1 | MISSING | No unit/integration tests for admin APIs, auth flows, cache invalidation, or contact delivery. | only 6 test files: `src/lib/*.test.ts`, `src/components/**/*.test.tsx` |
| 9.2 | P2 | MISSING | E2E covers only the public site; no admin CRUD, login, or publish→public-refresh test. | `e2e/public.spec.ts` |
| 9.3 | P2 | MISSING | No CI workflow; no visual regression baseline. | no `.github/` present |

---

## 10. Documentation drift

| # | Sev | Status | Finding |
|---|-----|--------|----------|
| 10.1 | P2 | PARTIAL | README documents log out all, preview, and section-driven content that are not fully implemented (see §1.3, §2, §5.3). README also claims broad `next/image` usage (§7.1). |
| 10.2 | P2 | MISSING | `ARCHITECTURE.md` does not mention the unimplemented OTP folders or the unread `SiteSection` module. |

---

## Suggested fix order (see `docs/ENHANCEMENT-PLAN.md` for the phased roadmap)

1. **P0 now:** remove/repair dead `verify`+`verify-otp` folders, fix mojibake, pin dependencies, add security headers.
2. **P1 next:** wire `SiteSection` to the public homepage; add structured admin fields + media pickers; build the contact inbox; add sitemap/robots/JSON-LD/page metadata; add loading states.
3. **P2 later:** trash/restore + audit log, revision history, preview, RSS, accessibility CI, admin account management, shared rate-limit store.
