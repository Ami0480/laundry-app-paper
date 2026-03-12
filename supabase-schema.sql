-- Run this in your Supabase SQL editor to set up the schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drying logs table
create table if not exists public.drying_logs (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  user_id     uuid references auth.users(id) on delete cascade,
  city        text not null,
  score       integer not null check (score between 0 and 100),
  temp        numeric(5,2) not null,
  humidity    integer not null,
  wind_speed  numeric(5,2) not null,
  advice      text not null
);

-- Home locations table (one per user)
create table if not exists public.home_locations (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid unique references auth.users(id) on delete cascade,
  city        text not null,
  lat         numeric(9,6) not null,
  lon         numeric(9,6) not null,
  updated_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.drying_logs      enable row level security;
alter table public.home_locations   enable row level security;

-- Policies: users can only read/write their own rows
drop policy if exists "Users manage own logs" on public.drying_logs;
drop policy if exists "Users manage own location" on public.home_locations;
drop policy if exists "Anon can insert logs" on public.drying_logs;

create policy "Users manage own logs"
  on public.drying_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own location"
  on public.home_locations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow anonymous inserts for demo (optional — remove in production)
create policy "Anon can insert logs"
  on public.drying_logs for insert
  to anon
  with check (user_id is null);
