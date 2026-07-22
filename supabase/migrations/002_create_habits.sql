-- ============================================================
-- Migration 002: habits
-- Run this after 001 in Supabase SQL Editor.
--
-- Stores each user's habits. All fields match the shape used
-- by the existing habitsService so no UI changes are needed.
-- RLS ensures each user can only access their own habits.
-- ============================================================

create table if not exists public.habits (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  description   text not null default '',
  category      text not null default 'General',
  color         text not null default '#4C6FFF',
  icon          text not null default 'Sparkles',
  priority      text not null default 'medium',  -- low | medium | high
  reminder_time text,                             -- "HH:MM" or null
  frequency     text not null default 'daily',   -- daily | weekly | monthly | custom
  background    text not null default 'stadium',
  archived      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.habits enable row level security;

-- Policy: select own habits
create policy "Users can view own habits"
  on public.habits
  for select
  using (auth.uid() = user_id);

-- Policy: insert own habits
create policy "Users can insert own habits"
  on public.habits
  for insert
  with check (auth.uid() = user_id);

-- Policy: update own habits
create policy "Users can update own habits"
  on public.habits
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: delete own habits
create policy "Users can delete own habits"
  on public.habits
  for delete
  using (auth.uid() = user_id);

-- Index for fast per-user queries
create index if not exists habits_user_id_idx on public.habits (user_id);
