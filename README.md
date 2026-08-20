# Cozy Stays

An Airbnb-style stays app: a landing page with a search bar and an
infinite-scroll grid of cozy listing cards, plus a `/listing/[id]` detail page.
Built with **Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui**,
backed by **Supabase (pg_graphql)** with typed queries from **GraphQL Code
Generator**.

## Running

```bash
npm install      # if needed
npm run dev      # http://localhost:3000
```

Needs a `.env.local` with `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
(deliberately not `NEXT_PUBLIC_` — the backend is only reached from the
server). The schema and seed live in `supabase/`; after editing any GraphQL
document in `src/app/api/`, run `npm run codegen` to regenerate the types in
`src/gql/`.

## Core idea: URL is the source of truth

Search (and, soon, filter) state lives entirely in the URL query string, so any
result is a shareable link:

```
/?location=Lisbon
/?location=California&guests=4
```

- `SearchBar` (client) reads the current params, and on submit pushes a new
  query string with `router.push`.
- `app/page.tsx` (server) reads `searchParams` and hands them to `ListingLoader`,
  which calls the API and renders the grid. Refresh or share the link and you get
  the same result.

See [API](#api) for how pagination fits alongside this — it's the one piece of
state deliberately kept out of the URL.

## API

The backend is Supabase pg_graphql, reached only from the server through
`src/app/api/server.ts` — the one place search and pagination are implemented.
Server components call it directly; the browser goes through
`GET /api/listings`, a thin HTTP adapter over the same module. That split keeps
the Supabase credentials and the GraphQL documents out of the client bundle,
and means the infinite scroll is a real network round trip through our own
route handler.

### Request

```
GET /api/listings?location=lisbon&guests=4&after=<cursor>&first=12
```

| Param      | Type     | Default | Notes                                                 |
| ---------- | -------- | ------- | ----------------------------------------------------- |
| `location` | string   | —       | Case-insensitive match on listing location or title   |
| `guests`   | number   | —       | Matches listings with `maxGuests >= guests`           |
| `after`    | cursor   | —       | Opaque; the previous page's `endCursor`. Omit for p.1 |
| `first`    | int 1–60 | `24`    | Clamped to `MAX_LIMIT`; malformed values fall back    |

### Response

```jsonc
{
  "listings": [
    /* this slice only */
  ],
  "totalCount": 37, // matches for the whole query, not just this slice
  "endCursor": "WzI0XQ==", // pass as `after` to fetch the next page
  "hasNextPage": true,
}
```

Two deliberate choices:

- **`totalCount` is the filtered count**, so the results header can say
  "37 stays" while only 24 are on screen. Using `listings.length` would
  under-report.
- **`hasNextPage` is computed server-side.** The client never does any
  count arithmetic itself; it just chases cursors until the flag goes false.

### Why cursors and not offsets

An earlier version used `skip`/`limit`, which was safe while the catalog was a
static in-memory array. Against a live database an insert shifts every later
offset, so a row added mid-scroll duplicates items across requests. A cursor
pins the next page to the last row already seen, so the list stays consistent
no matter what happens to the catalog between requests. The cursor is opaque
to every layer above the backend — the route handler passes it through
untouched, and the client just echoes back `endCursor`.

### Pagination state — deliberately not in the URL

Search params (`location`, `guests`) live in the URL. Pagination depth does
**not**, and that's intentional rather than an oversight.

The initial fetch is `first=24` (`DEFAULT_LIMIT` in `src/data/constants.ts`).
The server has no viewport, so this can't adapt to screen size — 24 fills the
widest grid (6 columns) and merely over-fetches a little on mobile, which is
cheaper than a second round trip. Appended pages live in `ListingFeed`'s client
state; refresh resets to the top.

Putting the depth in the URL (e.g. `?shown=48`) would restore scroll position
across refresh and back-navigation, but requires a client-state → URL write via
`history.replaceState` — notably **not** `router.replace()`, which would re-run
the server component on every scroll and re-render every card. That's additive
later; the API contract above doesn't change.

## Structure

```
src/
  app/
    page.tsx                        Landing page — reads searchParams, renders loader
    listing/[id]/
      page.tsx                      Detail page — fetches one listing, renders ListingDetail
      loading.tsx                   Streaming skeleton for the detail page
      not-found.tsx                 Unknown/invalid id
    api/
      index.ts                      fetchListings() — the browser's typed client for the route below
      server.ts                     GraphQL documents + fetchListings/fetchListingById (server-only)
      graphql.ts                    executeGraphQL() — fetch wrapper for Supabase pg_graphql
      listings/route.ts             GET /api/listings — HTTP edge over server.ts
    layout.tsx                      Root layout + fonts, header, search bar, BackToTop
    globals.css                     Tailwind v4 + shadcn theme tokens (warm coral palette)
    error.tsx                       Route error boundary
  components/                       One directory per component, skeleton alongside
    Header/Header.tsx
    SearchBar/
      SearchBar.tsx                 Client; owns the search inputs + URL push
      SearchBarSkeleton.tsx         Static replica used as the Suspense fallback
    SearchField/SearchField.tsx     Presentational field/divider used by SearchBar
    ListingLoader/
      ListingLoader.tsx             Async server component — fetches page 1, hands it to the feed
      ListingLoaderSkeleton.tsx     Suspense fallback (header + grid skeletons)
    FeaturedStaysHeader/
      FeaturedStaysHeader.tsx       "Featured stays in X" — takes `total`
      FeaturedStaysHeaderSkeleton.tsx
    ListingFeed/
      ListingFeed.tsx               Client; owns accumulated items + scroll append
    ListingGrid/
      ListingGrid.tsx               Responsive grid (1→6 cols) + empty state
      ListingGridSkeleton.tsx       Placeholder row, defaults to DEFAULT_LIMIT
    ListingCard/
      ListingCard.tsx               One stay (memo'd) — links to /listing/[id]
      ListingCardSkeleton.tsx
    ListingDetail/
      ListingDetail.tsx             Layout shell composing the sections below (all server)
      ListingHeader.tsx             Title + rating · reviews · location subline
      Gallery.tsx                   Cover + up to four tiles
      HomeDescription.tsx
      Amenities.tsx
      Host.tsx
      PriceSection.tsx              Sticky price card
    BackToTop/BackToTop.tsx
    ErrorDisplay/ErrorDisplay.tsx   Shown when the fetch throws
    icons/CozyHeart.tsx             Inline SVG heart
    ui/                             shadcn components (button, input, card, badge)
  data/
    types.ts                        Listing, ListingDetail, ListingQuery, ListingsPage
    constants.ts                    DEFAULT_LIMIT / MAX_LIMIT / AUTO_LOAD_PAGES
  gql/                              Generated by `npm run codegen` — do not edit by hand
  utils/index.ts                    cn(), toListing()
supabase/
  migrations/                       Schema + pg_graphql config
  seed.sql                          Generated by `npm run generate-seed`
scripts/                            Seed data + generator
```

## Next steps

- A filter sidebar — **ratings, location, laundry, pets-friendly, AC** — that
  writes to the same query string (e.g. `?minRating=4.8&laundry=true&pets=true`),
  keeping every result shareable. The `Listing.amenities` facets already exist
  for this.
- A dedicated `/search` results page if/when search should leave the landing page.
- **Listing detail page interactions.** `/listing/[id]` is shipped, and
  `ListingDetail` plus its sections are all server components today. Each
  interaction below becomes its own small client component under
  `components/ListingDetail/` — the shell stays server so the static parts
  ship no JS:
  - _Gallery lightbox_ — each photo clickable, opening a modal with the
    enlarged image (and prev/next to flip through the full set, since the
    grid only shows the first five).
  - _Reservation box_ — check-in / check-out calendar in `PriceSection` and a
    Reserve button to submit the booking. Depends on the date-availability
    modeling below; the `bookings` table already exists in the seed schema.
- Date availability (modeling availability ranges per listing).
- Unit tests

### Scaling infinite scroll past ~1,000 listings

Fine at 50 rows today. Ordered by cost — each stage waits for its trigger.

- **Done already** — `next/image` lazy-loads offscreen images (the dominant
  cost), `ListingCard` is `memo`'d. Enough for a few hundred cards.
- **1. `content-visibility: auto`** _(jank at ~300–500 cards)_ — skips offscreen
  layout/paint but keeps cards in the DOM, so SEO, Ctrl+F and a11y survive.
  Two lines of CSS. Needs `contain-intrinsic-size: auto <h>` or the scrollbar
  jitters, since card height varies ~285–420px across breakpoints.
- **2. Virtualize** _(~1,000+ cards, confirmed by a profile)_ — use
  `@tanstack/react-virtual` or `react-virtuoso`, **not** `react-window`, which
  scrolls its own inner div and would strand the header outside it. Needs a
  `ResizeObserver` for the 1→6 column count. Costs SEO, Ctrl+F, a11y — mitigate
  by leaving the server-rendered first page un-virtualized.
- **3. API changes** _(catalog in the millions)_ — cursor pagination is already
  in place; what remains is dropping the exact `totalCount`, since `COUNT(*)`
  over millions dominates the request — render "1,000+ stays" instead.
- **4. Evict far-offscreen pages** _(cap auto scroll for 6 pages)_ - Insert a
  load more button when user scrolled for 6 pages, that constant is defined in AUTO_LOAD_PAGES.
  Therefore no off screen footers.

## UX improvements

- [x] Font family: Done as of Jul 3, 2026
- [x] Remove host your home in tab
- [x] Add icon to Homes/Experiences
- [x] Remove the hero title, or make it muted a bit
- [x] Either remove label of Where and Who, or remove the icon. Looks clustered.
- [x] Listing Card: make image square
- [x] ListingCard: Rearrange the grey fonts. Looks clustered.
- [x] ListingCard: Refine the heart icon, make it dimmer, and no need to hover to red.
- [x] Add favicon
- [x] Add Where in search, can assume api is ready.
