# Backend Design — Real Database & API

Status: agreed design, pre-implementation.

Scope:

1. replace the in-memory mock backend (`src/lib/data.ts` + `src/app/api/server.ts`)
   with a real database and API, sized for ~1,000+ listings, and

2. listing detail page (`/listings/[id]`) as pure frontend work afterward.

## Goals

1. Feed the infinite-scroll feed from a real backend with enough rows (thousands)
   to genuinely test auto-load behavior.
2. Keep the feed payload lean: the landing page must never download detail-page
   data (descriptions, photo sets, reviews) for 24 cards × N pages.
3. Design the schema once, so the detail page (scope 2) requires no migration —
   only frontend work.
4. Work both locally and on the Vercel deployment from day one.
5. Preserve the existing architectural seam: `fetchListings` in
   `src/app/api/server.ts` is the single choke point where search + pagination
   live, so call sites don't move.

## Stack decision: Supabase (Postgres) + pg_graphql + GraphQL codegen

Chosen over the alternatives we considered:

| Option                                                   | Verdict                                                                                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SQLite + ORM (Drizzle/Prisma)                            | Simplest local setup, but doesn't run on the Vercel deployment; would force a Postgres migration later anyway.                                                           |
| Supabase via `supabase-js` REST (PostgREST)              | Field selection via `.select(...)`, less setup — but we want GraphQL's typed fragments and codegen.                                                                      |
| Hand-rolled GraphQL server (Yoga/Apollo in a Next route) | Full control over computed fields, but adds schema/resolver/N+1 work that doesn't pay for itself at this scale.                                                          |
| **Supabase + pg_graphql** (chosen)                       | GraphQL endpoint auto-generated from the tables — no resolver code. Compiles queries so unrequested joins never hit the DB. Hosted Postgres works on Vercel immediately. |

Cost accepted: Supabase project provisioning (interactive), env vars, codegen
setup, and reworking the feed's pagination to cursors (see below). Estimated
+2–3 hours over the SQLite path.

## Data model

### The summary/detail split is a projection concern, not a storage concern

There is **one** `listings` table plus relations. The feed and the detail page
are two different SELECTs over the same schema:

- Feed → summary columns only (what today's `Listing` type holds).
- Detail page → summary columns + description/host fields + joins.

With GraphQL, the split moves from hand-written server types into **client
fragments**:

- `ListingCardFields` — id, title, location, cover image, pricePerNight,
  rating, reviewCount, maxGuests, amenities.
- `ListingDetailFields` — spreads `ListingCardFields` and adds description,
  pictures, host, reviews(first: N), availability.

The fragment-spread relationship replaces the `interface ListingDetail extends
Listing` we would have written by hand, and GraphQL codegen generates the
TypeScript types from the fragments — so the feed _physically cannot_
over-fetch, and card/detail can never disagree on shared fields.

### Tables

- **`listings`** — id, title, location, price_per_night, rating, review_count,
  max_guests, amenity flags (laundry, pets_friendly, ac), description, and the
  host fields (host_name, host_avatar_url, host_joined_year, host_is_superhost —
  a separate `hosts` table is deferred until hosts own multiple listings).
- **`listing_images`** — listing_id, url, sort_order. The card's cover image is
  `sort_order = 0`; nothing is stored twice.
- **`reviews`** — listing_id, author, rating, body, created_at.
- **`bookings`** — listing_id, start_date, end_date. Bookings (blocked ranges)
  are the real-world source of truth; availability is _derived_, never stored.

### Design decisions on the relations

- **Reviews: embed top-N, don't ship all.** A popular listing can have hundreds
  of reviews — the same payload problem the summary/detail split solves, one
  level down. The detail query fetches `reviews(first: 6)`; `review_count` on
  the listing powers the "see all N reviews" affordance. A paginated reviews
  query can come later if ever needed.
- **Availability: bounded window, derived from bookings.** An unbounded list of
  available dates is infinite in principle. The detail page fetches the
  listing's `bookings` rows and derives a fixed window (today + 90 days) of
  available dates server-side in the Next.js page. If/when we want the API to
  expose `availableDates` directly, the upgrade path is a Postgres function
  that pg_graphql exposes — the storage model already supports it.
- **Host as an object, not a string.** Detail pages want more than a name
  (avatar, joined year, superhost badge). Cheap to seed, annoying to retrofit.

## Pagination: offset → cursor

pg_graphql exposes Relay-style connections (`first`/`after`,
`pageInfo.hasNextPage`/`endCursor`, `totalCount`) rather than `skip`/`limit`.
We accept — and welcome — this change: `server.ts` already documents offset
pagination as safe _only because the catalog is static_, and cursors are the
correct model for infinite scroll over mutable data.

Consequences:

- `ListingFeed` stores the last `endCursor` instead of deriving `skip` from
  `items.length`. (Side effect: `loadNextPage`'s dependency shifts from
  `items.length` to the cursor — one identity change per page, same as today.)
- `ListingsPage` in `src/lib/types.ts` is reshaped around
  `{ endCursor, hasNextPage, totalCount }`.
- Search filters map directly: location → `ilike`, guests → `maxGuests: {gte}`.

## Feed enhancements (frontend, independent of the backend)

- **Auto-load cap:** after N auto-loaded pages, replace the sentinel with an
  explicit "Load more" button so the footer stays reachable and a runaway
  scroll can't fetch the whole catalog.
- **Scroll-to-top:** floating button once the user is a few viewports deep.

## Seeding

Port the existing 50 hand-written listings, then generate a few thousand
synthetic rows (plus images, reviews, and bookings per listing) so infinite
scroll has real depth. Seed script lives in the repo and is re-runnable.

## What this unblocks

After this lands, the detail page (scope 2) is pure frontend: route
`/listings/[id]`, a `ListingDetailFields` query, gallery, availability
calendar from the bookings window, top-6 reviews. No schema or API changes.

## Implementation steps

1. Create the Supabase project (interactive — needs the account owner), wire
   `SUPABASE_URL` / keys into `.env.local` and Vercel env vars.
2. Write schema migration SQL for the four tables; enable pg_graphql.
3. Seed script: 50 real + ~2,000 synthetic listings with relations.
4. GraphQL codegen setup; define `ListingCardFields` fragment and the feed
   query.
5. Rewrite `fetchListings` in `src/app/api/server.ts` to call the GraphQL
   endpoint; reshape `ListingsPage` to cursor pagination; update `ListingFeed`
   to track `endCursor`.
6. Feed enhancements: auto-load cap + "Load more" fallback, scroll-to-top.
7. Verify on Vercel deployment.
