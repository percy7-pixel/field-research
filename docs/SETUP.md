# FIELD — Setup & Deployment (V1)

Everything here stays on free tiers. No custom domain required.

## 1. Database (Supabase) — one-time, ~3 minutes

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the contents of `supabase/schema.sql` → **Run**. (Creates tables, RLS policies, the subscribe RPC and the five initial topics.)
3. New query → paste `supabase/seed.sql` → **Run**. (Publishes Experiments #001–#003 and four Findings.)

Both scripts are idempotent — safe to re-run.

## 2. First admin user — one-time

Admin writes are allowed only for users listed in the `public.admins` table. Nothing else can write.

1. Supabase → **Authentication → Users → Add user → Create new user**. Enter your email + a strong password, tick *Auto Confirm User*.
2. Copy the new user's UUID.
3. SQL Editor:
   ```sql
   insert into public.admins (user_id, email) values ('<paste-uuid>', 'you@example.com');
   ```
4. Sign in at `/admin/login`.

To add more admins later, repeat steps 1–3. To revoke, delete the row.

Optional hardening: Authentication → Providers → Email → disable *Allow new users to sign up* (the site never uses public signup).

## 3. Environment variables

Local: copy `.env.example` → `.env.local` and fill in. Never commit `.env.local`.

Vercel: Project → Settings → Environment Variables:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | e.g. `https://field-research.vercel.app` (no trailing slash). Used for canonical URLs, sitemap, OG, unsubscribe links. |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Publishable key only. Never a secret/service-role key. |
| `RESEND_API_KEY` | for email | Server-only. Signup still saves the subscriber without it; only the welcome email is skipped. |
| `RESEND_FROM_EMAIL` | optional | Defaults to `FIELD <onboarding@resend.dev>` (works without a verified domain, but Resend only delivers to your own account email in that mode). Switch to your domain once verified. |
| `RESEND_AUDIENCE_ID` | optional | Mirrors subscribers into a Resend Audience for sending publication emails. |
| `AUTH_SECRET` | yes | `openssl rand -base64 32`. Signs unsubscribe links. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional | Leave empty until the GA4 web stream exists. Site works without it. |

## 4. Deploy

Push to `main` → Vercel builds automatically. After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the Vercel URL and redeploy once.

## 5. After deploy

- **Google Search Console**: add the Vercel URL as a property, submit `https://<url>/sitemap.xml`.
- **GA4**: create the web data stream with the Vercel URL, copy the Measurement ID into `NEXT_PUBLIC_GA_MEASUREMENT_ID`, redeploy.
- **Resend**: when a domain exists, verify it and change `RESEND_FROM_EMAIL`.

## 6. Publishing workflow (no code changes)

`/admin/experiments/new` → fill sections → **Save Draft** → **Preview** → **Validate** → **Publish**.
Public pages revalidate immediately on publish/unpublish; they also refresh every 5 minutes.

Findings and Field Notes: V1 manages them via SQL (pattern in `supabase/seed.sql`). Editors for them are the next admin routes to add.

## 7. Sending a publication email (manual, V1)

Subscribers live in `public.subscribers` (admin → Subscribers). Use Resend's dashboard (Broadcasts + Audience) to send a short, finding-led email. Include the unsubscribe URL pattern `/unsubscribe?email=…&token=…` — tokens are HMAC(email, AUTH_SECRET); welcome emails already include a correct link.

## Security notes

- RLS: anonymous users can only `select` rows with `status='published'` (plus topics). All writes require `public.is_admin()`.
- The `subscribers` table has no anonymous read/write; signups go through the `subscribe_email` SECURITY DEFINER function which validates and de-duplicates.
- Admin routes are gated in `src/proxy.ts` (session check) and again in every admin page/action via `requireAdmin()` (admins-table check). RLS is the final guard.
- Drafts are excluded from public pages, the sitemap and search. Admin pages send `noindex`.
