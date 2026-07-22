-- ============================================================
-- Migration 001: profiles
-- Run this first in Supabase SQL Editor.
--
-- Creates a `profiles` table that mirrors auth.users 1-to-1.
-- Stores display name and the user's chosen global background.
-- A trigger auto-creates the row when a new user signs up.
-- ============================================================

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  global_background text not null default 'stadium',
  updated_at    timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policy: users can read only their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: users can update only their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: users can insert only their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Trigger function: auto-create a profile row on new signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
