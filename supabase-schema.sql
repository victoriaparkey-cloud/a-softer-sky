-- ── soft skies — Supabase schema ──────────────────────────────────────────────
-- Paste this into the Supabase SQL editor (Database → SQL Editor → New query)
-- Run it once to set up your project.

-- ── Enable UUID generation ─────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Sky entries table ──────────────────────────────────────────────────────
create table if not exists sky_entries (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  photo_url       text not null,
  photo_thumb_url text,
  palette         jsonb not null default '[]',   -- array of { hex, name, population }
  title           text not null default '',
  mood            text not null default '',
  location        jsonb,                          -- { lat, lng, label }
  weather         jsonb,                          -- { condition, tempC, description }
  captured_at     timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Index for fast per-user journal queries
create index if not exists sky_entries_user_id_idx on sky_entries(user_id, captured_at desc);

-- ── Row-level security ─────────────────────────────────────────────────────
-- Users can only read and write their own entries.
alter table sky_entries enable row level security;

create policy "Users can view their own entries"
  on sky_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on sky_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on sky_entries for delete
  using (auth.uid() = user_id);

-- ── Storage bucket ─────────────────────────────────────────────────────────
-- Run this separately in the Supabase Storage settings, or via the dashboard:
-- 1. Go to Storage → Create bucket
-- 2. Name: sky-photos
-- 3. Public: yes (so photo URLs work without auth tokens)
-- 4. Add the following RLS policy on the bucket:

-- insert policy (authenticated users can upload to their own folder):
-- bucket_id = 'sky-photos' AND auth.uid()::text = (storage.foldername(name))[1]

-- ── Done ───────────────────────────────────────────────────────────────────
-- After running this, copy your project URL and anon key from:
-- Settings → API → Project URL + anon/public key
-- Paste into your .env file.
