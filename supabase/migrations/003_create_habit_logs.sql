-- ============================================================
-- Migration 003: habit_logs
-- Run this after 002 in Supabase SQL Editor.
--
-- Tracks which days each habit was completed.
-- Shape mirrors the existing logs structure:
--   { [habitId]: { [dateISO]: true } }
-- The unique constraint on (habit_id, date) prevents duplicates.
-- Cascades on habit delete so logs are cleaned up automatically.
-- ============================================================

create table if not exists public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null,                -- ISO date "YYYY-MM-DD"
  created_at timestamptz not null default now(),

  -- Prevent double-logging the same habit on the same day
  unique (habit_id, date)
);

-- Enable Row Level Security
alter table public.habit_logs enable row level security;

-- Policy: select own logs
create policy "Users can view own logs"
  on public.habit_logs
  for select
  using (auth.uid() = user_id);

-- Policy: insert own logs
create policy "Users can insert own logs"
  on public.habit_logs
  for insert
  with check (auth.uid() = user_id);

-- Policy: delete own logs (used when toggling completion off)
create policy "Users can delete own logs"
  on public.habit_logs
  for delete
  using (auth.uid() = user_id);

-- Indexes for fast lookups
create index if not exists habit_logs_habit_id_idx on public.habit_logs (habit_id);
create index if not exists habit_logs_user_id_idx  on public.habit_logs (user_id);
create index if not exists habit_logs_date_idx     on public.habit_logs (date);
