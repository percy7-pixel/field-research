-- FIELD — Supabase schema v1
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Idempotent where practical.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admins: users allowed to write content. Add rows manually (see docs/SETUP.md).
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Topics
-- ---------------------------------------------------------------------------
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Experiments (primary research object)
-- ---------------------------------------------------------------------------
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  experiment_number int not null unique,
  slug text not null unique,
  title text not null,
  subtitle text,
  status text not null default 'draft' check (status in ('draft','published')),
  publication_date date,
  last_updated date,
  short_summary text,
  research_question text,
  hypothesis text,
  workflow text,
  workflow_steps jsonb not null default '[]'::jsonb,          -- string[]
  research_type text,
  methodology text,
  dataset_description text,
  sample_size int,
  human_baseline text,
  ai_baseline text,
  evaluation_criteria jsonb not null default '[]'::jsonb,     -- {name, description}[]
  results text,
  key_findings jsonb not null default '[]'::jsonb,            -- string[]
  failure_modes jsonb not null default '[]'::jsonb,           -- {code, name, description}[]
  observations jsonb not null default '[]'::jsonb,            -- string[]
  interpretations jsonb not null default '[]'::jsonb,         -- string[]
  unknowns jsonb not null default '[]'::jsonb,                -- string[]
  what_changed text,
  limitations jsonb not null default '[]'::jsonb,             -- string[]
  conclusion text,
  practical_implications jsonb not null default '[]'::jsonb,  -- string[]
  cases jsonb not null default '[]'::jsonb,                   -- {id, summary, human?, ai?}[]
  related_experiments jsonb not null default '[]'::jsonb,     -- slug[]
  topics jsonb not null default '[]'::jsonb,                  -- topic slug[]
  tags jsonb not null default '[]'::jsonb,                    -- string[]
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  og_image text,
  author text not null default 'FIELD',
  sources jsonb not null default '[]'::jsonb,                 -- {label, url}[]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists experiments_status_pub_idx on public.experiments (status, publication_date desc);
create index if not exists experiments_topics_gin on public.experiments using gin (topics);
create index if not exists experiments_tags_gin on public.experiments using gin (tags);

-- ---------------------------------------------------------------------------
-- Findings (must trace back to an experiment)
-- ---------------------------------------------------------------------------
create table if not exists public.findings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  source_experiment uuid references public.experiments(id) on delete restrict,
  evidence jsonb not null default '[]'::jsonb,                -- string[]
  topic text,
  date date,
  tags jsonb not null default '[]'::jsonb,
  related_findings jsonb not null default '[]'::jsonb,        -- slug[]
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists findings_status_date_idx on public.findings (status, date desc);
create index if not exists findings_source_idx on public.findings (source_experiment);

-- ---------------------------------------------------------------------------
-- Field notes
-- ---------------------------------------------------------------------------
create table if not exists public.field_notes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  date date,
  related_experiments jsonb not null default '[]'::jsonb,
  topics jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  featured_image text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists field_notes_status_date_idx on public.field_notes (status, date desc);

-- ---------------------------------------------------------------------------
-- Subscribers (email only)
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active' check (status in ('active','unsubscribed')),
  source text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  foreach t in array array['experiments','findings','field_notes'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public: read published content + topics. Admins: full write. Nobody else writes.
-- Subscribers: no public access at all (writes go through a SECURITY DEFINER RPC).
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.topics enable row level security;
alter table public.experiments enable row level security;
alter table public.findings enable row level security;
alter table public.field_notes enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (auth.uid() = user_id);

drop policy if exists "topics public read" on public.topics;
create policy "topics public read" on public.topics for select using (true);
drop policy if exists "topics admin write" on public.topics;
create policy "topics admin write" on public.topics for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "experiments public read published" on public.experiments;
create policy "experiments public read published" on public.experiments for select
  using (status = 'published' or public.is_admin());
drop policy if exists "experiments admin write" on public.experiments;
create policy "experiments admin write" on public.experiments for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "findings public read published" on public.findings;
create policy "findings public read published" on public.findings for select
  using (status = 'published' or public.is_admin());
drop policy if exists "findings admin write" on public.findings;
create policy "findings admin write" on public.findings for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "field_notes public read published" on public.field_notes;
create policy "field_notes public read published" on public.field_notes for select
  using (status = 'published' or public.is_admin());
drop policy if exists "field_notes admin write" on public.field_notes;
create policy "field_notes admin write" on public.field_notes for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "subscribers admin read" on public.subscribers;
create policy "subscribers admin read" on public.subscribers for select using (public.is_admin());

-- Subscribe RPC: callable with the publishable key, but never exposes the table.
-- Returns 'created' | 'exists' | 'reactivated'.
create or replace function public.subscribe_email(p_email text, p_source text default null)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_status text;
begin
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 254 then
    raise exception 'invalid_email';
  end if;
  select status into v_status from public.subscribers where email = v_email;
  if v_status is null then
    insert into public.subscribers (email, source) values (v_email, left(coalesce(p_source,''), 64));
    return 'created';
  elsif v_status = 'unsubscribed' then
    update public.subscribers set status = 'active', unsubscribed_at = null where email = v_email;
    return 'reactivated';
  else
    return 'exists';
  end if;
end $$;

create or replace function public.unsubscribe_email(p_email text)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  update public.subscribers set status = 'unsubscribed', unsubscribed_at = now()
  where email = lower(trim(p_email)) and status = 'active';
  return found;
end $$;

revoke all on function public.subscribe_email(text, text) from public;
grant execute on function public.subscribe_email(text, text) to anon, authenticated;
revoke all on function public.unsubscribe_email(text) from public;
grant execute on function public.unsubscribe_email(text) to anon, authenticated;

-- Topics seed
insert into public.topics (slug, name, description, sort_order) values
  ('customer-workflows','Customer Workflows','Inquiries, qualification, replies and the work between a message and a decision.',1),
  ('information-processing','Information Processing','Turning messy inputs into structured, checkable outputs.',2),
  ('decision-support','Decision Support','Preparing the next action without becoming the decision-maker.',3),
  ('human-ai','Human + AI','Where human judgment and AI output diverge, converge, and combine.',4),
  ('ai-reliability','AI Reliability','Failure modes, fabrication, overconfidence and correction burden.',5)
on conflict (slug) do nothing;
