# Cozy Stays

An Airbnb-style stays app: a landing page with a search bar and a grid of cozy
listing cards. Built with **Next.js 15 (App Router) · React 19 · Tailwind CSS v4 ·
shadcn/ui**.

## Running

```bash
npm install      # if needed
npm run dev      # http://localhost:3000
```

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

A stubbed backend at `GET /api/listings`. Filtering and pagination both happen
server-side so the frontend talks to it like a real service — swap the in-memory
work in the route handler for a DB call and no client code changes.

### Request

```
GET /api/listings?location=lisbon&guests=4&skip=24&limit=12
```

| Param      | Type     | Default | Notes                                               |
| ---------- | -------- | ------- | --------------------------------------------------- |
| `location` | string   | —       | Case-insensitive match on listing location or title |
| `guests`   | number   | —       | Matches listings with `maxGuests >= guests`         |
| `skip`     | int ≥ 0  | `0`     | Offset into the filtered results                    |
| `limit`    | int 1–60 | `24`    | Clamped to `MAX_LIMIT`; malformed values fall back  |

### Response

```jsonc
{
  "listings": [
    /* this slice only */
  ],
  "total": 37, // matches for the whole query, not just this slice
  "skip": 24,
  "limit": 12,
  "hasMore": true,
}
```

Two deliberate choices:

- **`total` is the filtered count**, so the results header can say "37 stays"
  while only 24 are on screen. Using `listings.length` would under-report.
- **`hasMore` is computed server-side.** The client never does the
  `skip + length < total` arithmetic itself, so the field keeps meaning the same
  thing if this ever moves to cursor pagination.

### Why `skip`/`limit` and not `page`/`limit`

A page number only has meaning relative to a limit — `page=2` is items 6–11 at
`limit=6` but items 24–47 at `limit=24`. `skip` is an absolute position, which
buys two things:

1. **No counter to keep in sync.** The client derives `skip` from
   `items.length` — data it already holds. A `page` counter is separate state
   that can drift from the list after a failed request or a filter change.
2. **Restoring N items takes one request.** `skip=0&limit=48` fetches 48 in one
   call; `page`-based would need four calls at `limit=12`, or a one-off larger
   limit that contradicts the fixed page size.

Offset pagination is safe here because the catalog is static. Against a mutable
dataset an insert would shift every later offset and duplicate items across
requests — that's the point to switch to cursors (`?after=<cursor>&limit=20`).

### Pagination state — deliberately not in the URL

Search params (`location`, `guests`) live in the URL. Pagination depth does
**not**, and that's intentional rather than an oversight.

The initial fetch is `skip=0&limit=24` (`DEFAULT_LIMIT` in `lib/pagination.ts`).
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
    api/
      index.ts                      fetchListings() — typed client for the route below
      listings/route.ts             GET /api/listings — filter + paginate
    layout.tsx                      Root layout + Inter font
    globals.css                     Tailwind v4 + shadcn theme tokens (warm coral palette)
  components/                       One directory per component, skeleton alongside
    Header/Header.tsx
    SearchBar/SearchBar.tsx         Client; owns the search inputs + URL push
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
      ListingCard.tsx               One stay (memo'd)
      ListingCardSkeleton.tsx
    ErrorDisplay/ErrorDisplay.tsx   Shown when the fetch throws
    icons/CozyHeart.tsx             Inline SVG heart
    ui/                             shadcn components (button, input, card, badge)
  lib/
    types.ts                        Listing, ListingQuery, ListingsPage
    data.ts                         Sample listings (50)
    pagination.ts                   DEFAULT_LIMIT / MAX_LIMIT
    utils.ts                        cn()
```

## Next steps

- A filter sidebar — **ratings, location, laundry, pets-friendly, AC** — that
  writes to the same query string (e.g. `?minRating=4.8&laundry=true&pets=true`),
  keeping every result shareable. The `Listing.amenities` facets already exist
  for this.
- A dedicated `/search` results page if/when search should leave the landing page.
- Date availability (modeling availability ranges per listing).
- Unit tests
- TODO: scaling infinite scroll past ~1,000 listings

### TODO: scaling infinite scroll past ~1,000 listings

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
- **3. API changes** _(real backend with mutable data)_ — switch to cursor
  pagination (offset drifts when rows are inserted mid-list, duplicating items);
  drop the exact `total`, since `COUNT(*)` over millions dominates the request —
  render "1,000+ stays" instead.
- **4. Evict far-offscreen pages** _(heap growth over a long session)_ — Stage 2
  windows the DOM, but `items` still grows forever. Needs upward refetch, hence
  last.
- **Consider first:** nobody scrolls 1,000 stays. Better filters, sort, and a
  result cap beat virtualization — that only makes bad browsing faster.

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
