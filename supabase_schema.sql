-- Pinterest Pin Generation System Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Assets Table
create table if not exists public.assets (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    image_url text not null,
    share_token text unique default encode(gen_random_bytes(16), 'hex'),
    analysis jsonb,
    status text default 'analyzing' check (status in ('analyzing', 'ready', 'scheduled', 'posted'))
);

-- Boards Table
create table if not exists public.boards (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pins Table (Variants for each asset)
create table if not exists public.pins (
    id uuid primary key default uuid_generate_v4(),
    asset_id uuid references public.assets(id) on delete cascade not null,
    type text not null check (type in ('SEO', 'Buyer Intent', 'Curiosity')),
    title text not null,
    description text not null,
    destination_url text,
    board_name text,
    status text default 'planned' check (status in ('planned', 'shared')),
    shared_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Schedule Table
create table if not exists public.schedule (
    id uuid primary key default uuid_generate_v4(),
    pin_id uuid references public.pins(id) on delete cascade not null,
    scheduled_at timestamp with time zone not null,
    is_posted boolean default false not null
);

-- App Settings (for Rules and Offsets)
create table if not exists public.app_settings (
    key text primary key,
    value jsonb not null
);

-- RLS (Row Level Security)
alter table public.assets enable row level security;
alter table public.pins enable row level security;
alter table public.schedule enable row level security;
alter table public.boards enable row level security;
alter table public.app_settings enable row level security;

create policy "Enable all for public" on public.assets for all using (true);
create policy "Enable all for public" on public.pins for all using (true);
create policy "Enable all for public" on public.schedule for all using (true);
create policy "Enable all for public" on public.boards for all using (true);
create policy "Enable all for public" on public.app_settings for all using (true);

-- Storage Policies for 'assets' bucket
insert into storage.buckets (id, name, public) values ('assets', 'assets', true)
on conflict (id) do update set public = true;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'assets' );
create policy "All access for authenticated" on storage.objects for all using ( bucket_id = 'assets' );
