# My Wall

A polished, responsive recreation of the 2008–2009 Facebook Wall experience, built with a modern Next.js stack. Visitors can publish short messages without an account; Supabase stores every post and broadcasts new posts to other open browsers in real time.

## Features

- Anonymous post creation with validation, loading, and error states
- Persistent Supabase PostgreSQL feed, newest first
- Supabase Realtime updates with duplicate protection
- Optional JPEG, PNG, and WebP photo uploads through Supabase Storage
- 280-character composer and server-side validation
- Per-IP burst rate limiting (three posts per minute per running instance)
- Pagination, search, skeletons, toast feedback, and relative timestamps
- Responsive three-column classic profile layout
- Canonical metadata, Open Graph cards, JSON-LD, sitemap, robots rules, and web manifest
- Strict TypeScript, accessible focus states, and reduced-motion support

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn-style UI primitives, Lucide React, Motion, Sonner, and Supabase.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project. In its SQL Editor, run [`supabase/migrations/202611150001_create_posts.sql`](supabase/migrations/202611150001_create_posts.sql).

3. Copy `.env.example` to `.env.local` and add the project URL and publishable/anonymous key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   The anonymous key is designed for browser use. Never add a service-role key to this project.

4. Start the application:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## Supabase configuration

The included migrations create `public.posts`, a public `wall-photos` Storage bucket, chronological indexes, file/content constraints, and Row Level Security policies. Anonymous visitors can read and insert valid posts and upload validated images; they cannot update or delete posts or stored objects. The posts table is also added to the Supabase Realtime publication.

The publishing endpoint uses the Supabase anonymous key, so database RLS remains the final authorization boundary. It applies an additional best-effort in-memory burst limit. For high-traffic production use, replace that layer with a durable Upstash or database-backed limiter.

## Vercel deployment

1. Push the repository to GitHub and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Project Settings → Environment Variables.
3. Add `NEXT_PUBLIC_SITE_URL` with the final production URL, such as `https://your-project.vercel.app`.
4. Deploy. No custom build command is required.
5. Publish a test post, refresh, and confirm it remains visible. Open a second browser to verify Realtime updates.

## Acceptance checks

```bash
npm run typecheck
npm run lint
npm run build
```

Then verify publishing, refresh persistence, newest-first order, empty/oversized validation, rapid duplicate clicks, and cross-browser Realtime updates against the configured Supabase project.
