# FIELD — AI, put to the test.

A practical AI workflow research publication. Structured Experiments are the primary content object; Findings trace back to them; Field Notes are explicitly not evidence.

**Stack:** Next.js (App Router) · TypeScript · Tailwind · Supabase (Postgres + Auth + RLS) · Resend · Vercel. Free tier throughout.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Then follow `docs/SETUP.md` to apply `supabase/schema.sql`, `supabase/seed.sql` and create the first admin.

## Layout

```
src/app/                 routes (public + /admin)
src/components/          UI (ExperimentArticle renders every experiment from data)
src/lib/queries/         public read queries (RLS: published only)
src/lib/admin/           auth guard + experiment validation schema
src/lib/email/           Resend + unsubscribe token
supabase/schema.sql      tables, indexes, RLS, RPCs, topics
supabase/seed.sql        Experiments #001–#003, initial Findings
docs/SETUP.md            deployment + admin setup
```

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`
