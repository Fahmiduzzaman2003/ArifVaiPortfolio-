# Architecture and product map

## System shape

The product is a modular Next.js monolith. Public pages, the admin workspace, route handlers, validation, services, database access, cache invalidation, authentication, and media signing ship in one deployable application. MongoDB Atlas stores content and security records; Cloudinary stores binaries; Resend delivers transactional email.

```text
Public/admin UI
  → React Hook Form or TanStack Query
  → Next.js route handler
  → Zod validation + authentication/origin/rate checks
  → focused domain operation
  → Mongoose model / Cloudinary / Resend
  → normalized response
  → server tag/path revalidation + client query invalidation
```

## Public routes

- `/`: editorial research homepage
- `/research`: connected research agenda
- `/publications` and `/publications/[slug]`: filtered record and evidence-rich paper detail
- `/projects` and `/projects/[slug]`: project case studies
- `/about`, `/experience`, `/education`, `/achievements`, `/activities`, `/skills`
- `/contact`: validated, rate-limited research inquiry
- `/cv`: active Cloudinary document preview/download state

## Admin modules

Profile, publications, research interests, projects, experience, education, achievements, activities, skills, homepage sections, media/CV, and settings. Shared controls cover drafts, publishing, visibility, featuring, duplication, soft deletion, search, and editing. The schemas retain relationship fields for papers, interests, projects, and experience.

## Authentication and media

Password verification uses Argon2. Successful password entry immediately creates an eight-hour signed HTTP-only session. Password reset tokens are random, hashed, expiring, single-use records and reset increments `sessionVersion` to invalidate all sessions.

The server issues narrowly scoped Cloudinary signatures after checking the admin session, folder, MIME type, and size. MongoDB stores asset metadata only.

## Caching

Stable public routes can use ISR and cached lean queries. Domain tags map to affected public paths. Every content mutation invalidates its tag and calls `revalidatePath` for the homepage, list, and detail pages as needed. TanStack Query separately caches browser/admin lists and invalidates after mutation. Auth, reset, contact, and private admin responses are never cached.

## Deployment choice

Vercel is preferred: all server behavior fits route handlers and does not need a persistent process. Use Atlas free cluster, Cloudinary free plan, and Resend free allowance. Railway remains compatible but adds no benefit unless the application later gains persistent-server requirements.
