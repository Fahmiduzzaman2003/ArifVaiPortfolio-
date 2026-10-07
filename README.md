# Research Field Notes

A research-first academic portfolio and content workspace for a PhD aspirant working across Machine Learning, Computer Vision, BioML, medical imaging, agricultural AI, and applied deep learning. The interface prioritizes research direction, publication evidence, individual contribution, ongoing work, and collaboration fit rather than presenting a generic developer résumé.

The repository ships with **clearly marked `YOUR_*` placeholders only**. It does not invent papers, institutions, metrics, awards, DOI values, or academic claims.

## Stack

- Next.js App Router, React, strict TypeScript, Tailwind CSS
- Radix/shadcn-style UI primitives, Framer Motion, Lucide icons
- React Hook Form + Zod; TanStack Query for browser/admin content caching
- MongoDB Atlas + Mongoose
- Cloudinary signed direct uploads (images and documents)
- Resend transactional email
- Argon2 password hashing, JOSE signed HTTP-only sessions
- Vitest and Playwright

## Architecture

The application is a modular monolith designed for one Vercel deployment. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the route map, request flow, authentication design, media flow, caching strategy, and deployment decision.

Key directories:

```text
src/app/                 public pages, admin pages, and route handlers
src/components/          research UI, publications, projects, admin, forms
src/config/              admin module field definitions
src/lib/                 auth, database, caching, email, security, validation
src/models/              Mongoose schemas and indexes
src/services/            cached public-content queries and view mapping
src/types/               public content contracts
scripts/                 initial admin bootstrap
e2e/                     Playwright browser tests
```

Public reads use cached, lean Mongoose queries and fall back to conspicuous demonstration placeholders before MongoDB is configured or populated. Admin mutations invalidate both server route tags/paths and the corresponding TanStack Query list.

## Public experience and motion language

The public interface uses the **Latent Field Atlas** direction: a dark research-laboratory canvas where BioML, medical imaging, agricultural AI, papers, projects, and evidence form one connected visual system. Publications receive the strongest editorial treatment, while the research map exposes relationships without becoming the only way to reach the underlying content.

Motion is centralized in `src/lib/motion.ts` and follows four levels:

1. **Micro (120–250 ms):** focus, link, copy, button, and filter feedback.
2. **Component (250–500 ms):** publication transitions, mobile navigation, expanded evidence, and viewers.
3. **Story:** scroll progress, research-map activation, publication staging, and experience tracing.
4. **Ambient:** slow, low-contrast data traces and feature patches; never required for comprehension.

Effects favor opacity and transforms, pause naturally when components leave the page, and are removed or simplified when `prefers-reduced-motion` is enabled. Desktop pointer depth becomes a touch-friendly stacked research deck on smaller screens. The network includes semantic buttons and a list presentation, so all research content remains available to keyboard and screen-reader users.

## Local setup

Prerequisites: Node.js 20+ and an npm-compatible package manager.

```bash
npm install
copy .env.example .env.local
npm run seed:admin
npm run dev
```

Open `http://localhost:3000` and sign in at `/admin/login`.

### Environment variables

Copy `.env.example` and fill every production value. Never commit `.env.local`.

- `MONGODB_URI`: Atlas connection string with a least-privilege database user.
- `SESSION_SECRET`: 32+ random bytes used to sign admin sessions.
- `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD`: used only by the bootstrap script. Remove them from the deployment environment afterward.
- `CLOUDINARY_*`: server credentials. Only the cloud name is public.
- `RESEND_API_KEY`, `EMAIL_FROM`: Resend API key and a sender on a verified domain.
- `CONTACT_RECIPIENT_EMAIL`: destination for research inquiries. If omitted, the public email saved under Admin → Profile is used.
- `NEXT_PUBLIC_APP_URL`: exact public origin, used for mutation-origin checking and reset links.

Generate secrets with a cryptographically secure password manager or platform secret generator.

## Service setup

### MongoDB Atlas

1. Create a free M0 cluster and a dedicated application database user.
2. Restrict network access as far as the deployment platform permits.
3. Put the connection string in `MONGODB_URI`.
4. Run `npm run seed:admin` once.
5. Atlas backups are not included on every free plan. Export important collections periodically with `mongodump` or Atlas Data Explorer, encrypt archives, and test restoration.

Mongoose uses a cached connection with a small pool for serverless execution. Schemas include timestamps, unique slugs/DOIs, content-state fields, visibility, featured order, search/category/year indexes, relationships, and soft deletion where recovery is useful.

### Cloudinary

1. Create a free Cloudinary product environment.
2. Configure the three Cloudinary server variables.
3. The admin requests a short-lived signature from `/api/admin/media/signature`, then uploads directly to Cloudinary.
4. Allowed folders and MIME/size constraints are checked before signing. Persist the returned secure URL, public ID, format, dimensions, bytes, and resource type in the media library.
5. Use Cloudinary transformations (`f_auto,q_auto`) for responsive image delivery. Never store binary files in MongoDB.

Asset replacement should create a new version first. Only delete the old public ID after confirming no content record references it. PDFs use Cloudinary raw delivery and browser preview where supported.

### Email

Verify the sender domain in Resend, then set `RESEND_API_KEY`, `EMAIL_FROM`, and the contact recipient. Localhost and deployed builds use the same delivery path. The contact API stores every valid inquiry, records the provider delivery state, and reports success only after Resend accepts the message. See [CONTACT_EMAIL_SETUP.md](./docs/CONTACT_EMAIL_SETUP.md) for the exact local and deployment checklist.

## Authentication flow

1. Email and password are rate-limited and verified with Argon2.
2. Successful verification issues an eight-hour signed HTTP-only admin session.
3. Password-reset tokens are random, hashed, single-use, and expire after 30 minutes. A successful reset increments `sessionVersion`, invalidating all active sessions.
4. “Logout all” also increments the version. Admin APIs recheck the active account/version in MongoDB.

Forgot-password responses are deliberately generic. Authentication, reset tokens, sessions, private admin records, and contact messages are never cached.

## Content workflow

Use `/admin` for profile, research interests, publications, projects, work experience, education, achievements, activities, skills, homepage sections, media/CV, and settings.

Content begins as a draft. Review the public preview, replace every `YOUR_*` placeholder, attach verified evidence, then publish. Controls support editing, duplicating, publishing states, featuring, show/hide, search, and recoverable deletion. Section records provide heading, description, visibility, and display order. Publication fields are grouped by basic identity, venue, research problem/contribution, methods/evidence, external material, and display state.

Recommended publication sequence:

1. Add title, slug, type, date, and summary.
2. Add authors, author position, venue, and publisher.
3. Explain the problem, gap, main contribution, and your individual contribution.
4. Record verified methodology, datasets, models, metrics, results, limitations, and future work.
5. Add DOI (without inventing it), publisher, PDF, code, dataset, project, citation, and BibTeX.
6. Upload visual assets, preview, set visibility/featured order, and publish.

## Caching and invalidation

- Stable public queries use Next.js cache tags and time-based revalidation.
- Public database reads use projections where appropriate, `.lean()`, indexes, bounded lists, and no N+1 population.
- Content mutations map their domain to the homepage, list page, and affected detail path and immediately call tag/path revalidation.
- TanStack Query uses sensible stale times, retains list state, and invalidates the relevant module after mutation.
- Cloudinary supplies CDN caching and versioned URLs; Next Image negotiates AVIF/WebP.
- Auth/contact responses are private and uncached.

To add a content section: add/extend its Mongoose schema, register it in `contentModels`, define user-facing fields in `src/config/admin-modules.ts`, add the public cached service mapping, and extend `pathsByModule` in the cache module.

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

Playwright starts the dev server automatically. Authentication/email/upload integration tests require configured test credentials and services; never point destructive tests at production.

## Deployment

### Vercel (recommended)

1. Push to a private Git repository and import it into Vercel.
2. Add production environment variables; set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin.
3. Deploy and run `npm run seed:admin` locally against the production Atlas URI once.
4. Verify public pages, Atlas connectivity, admin login, reset email, contact delivery, Cloudinary signature/upload, CV preview/download, and that publishing a draft immediately updates the public page.
5. Keep functions in the same deployment region as Atlas when possible.

Free-tier discipline: image transformations and CDN delivery reduce bandwidth; public reads are cached; list payloads are bounded; the Mongoose connection is reused; no persistent server, Redis, queues, or paid service is required.

### Railway compatibility

Railway can run `npm run build` followed by `npm start` with the same variables. Use it only if a future feature genuinely needs a persistent Node process. Do not split the frontend and API across Vercel/Railway without a measured reason.

## Troubleshooting

- **Database timeout:** verify `MONGODB_URI`, Atlas network access, credentials, and database-user privileges.
- **Reset email not delivered:** verify the Resend sender status, API key, recipient, and logs.
- **Immediate logout:** confirm `SESSION_SECRET` is identical across instances and at least 32 characters.
- **Admin save succeeds but public page is stale:** check the module-to-path mapping in `src/lib/cache/content-cache.ts` and Vercel function logs.
- **Upload signature rejected:** ensure MIME type, file size, folder, Cloudinary time, and server credentials match.
- **Duplicate DOI/slug:** unique indexes intentionally reject the write; correct the record rather than bypassing the index.
- **Build lacks secrets:** public placeholder builds are supported, but authenticated and database operations require runtime secrets.

## Accessibility and content safety

The UI uses semantic landmarks, keyboard-operable controls, visible focus states, contrast-aware colors, reduced-motion support, descriptive links, responsive layouts, and explicit alt-text fields. External academic links should be verified and open with `noopener noreferrer`. Keep claims factual, include limitations, and never promote ongoing results as established evidence.
