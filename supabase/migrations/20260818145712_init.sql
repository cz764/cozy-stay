-- Schema for cozy-stays — see BackendDesign.md.
-- Run in the Supabase SQL Editor (or via `supabase db push` once the CLI is linked).

-- pg_graphql serves the GraphQL API; pg_trgm accelerates the ilike search.
create extension if not exists pg_graphql;
create extension if not exists pg_trgm;

-- Inflection: snake_case columns/tables become camelCase fields / PascalCase types
-- in GraphQL (price_per_night -> pricePerNight, listings -> Listing).
comment on schema public is e'@graphql({"inflect_names": true})';

create table public.listings (
  id bigint generated always as identity primary key,
  title text not null,
  location text not null,
  price_per_night integer not null,
  rating numeric(3,2) not null,
  review_count integer not null default 0,
  max_guests integer not null,
  laundry boolean not null default false,
  pets_friendly boolean not null default false,
  ac boolean not null default false,
  description text not null default '',
  host_name text not null,
  host_avatar_url text not null default '',
  host_joined_year integer not null,
  host_is_superhost boolean not null default false,
  created_at timestamptz not null default now()
);

-- totalCount on the connection is opt-in in pg_graphql; the feed's
-- "You've seen all N stays" needs it.
comment on table public.listings is e'@graphql({"totalCount": {"enabled": true}})';

create table public.listing_images (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listings (id) on delete cascade,
  url text not null,
  -- sort_order = 0 is the card's cover image; nothing is stored twice.
  sort_order integer not null default 0
);

create table public.reviews (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listings (id) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);

-- Blocked date ranges. Availability is derived from these, never stored.
create table public.bookings (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listings (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  check (end_date >= start_date)
);

-- Feed search is `location/title ilike '%needle%'` — trigram indexes make that
-- an index scan instead of a full-table scan.
create index listings_location_trgm on public.listings using gin (location gin_trgm_ops);
create index listings_title_trgm on public.listings using gin (title gin_trgm_ops);
create index listings_max_guests on public.listings (max_guests);
create index listing_images_listing on public.listing_images (listing_id, sort_order);
create index reviews_listing_created on public.reviews (listing_id, created_at desc);
create index bookings_listing on public.bookings (listing_id, start_date);

-- Public read-only catalog: anyone may select, nobody may write through the API.
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.reviews enable row level security;
alter table public.bookings enable row level security;

create policy "public read" on public.listings for select using (true);
create policy "public read" on public.listing_images for select using (true);
create policy "public read" on public.reviews for select using (true);
create policy "public read" on public.bookings for select using (true);
