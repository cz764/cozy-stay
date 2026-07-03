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
- `app/page.tsx` (server) reads `searchParams`, filters the data, and renders the
  grid. No client-side data state — refresh or share the link and you get the
  same result.

## Structure

```
src/
  app/
    page.tsx               Landing page — reads searchParams, filters, renders
    layout.tsx             Root layout + Inter font
    globals.css            Tailwind v4 + shadcn theme tokens (warm coral palette)
  components/
    Header.tsx
    SearchBar.tsx          Client; owns the search inputs + URL push
    SearchField.tsx        Presentational field/divider used by SearchBar
    ListingCard.tsx        One stay
    ListingCardSkeleton.tsx
    ListingGrid.tsx        Grid; supports isLoading skeleton + empty state
    ui/                    shadcn components (button, input, card, badge)
  lib/
    types.ts               Listing
    data.ts                Sample listings
    utils.ts               cn()
```

## Next steps (not yet built)

- A filter sidebar — **ratings, location, laundry, pets-friendly, AC** — that
  writes to the same query string (e.g. `?minRating=4.8&laundry=true&pets=true`),
  keeping every result shareable. The `Listing.amenities` facets already exist
  for this.
- A dedicated `/search` results page if/when search should leave the landing page.
- Date availability (modeling availability ranges per listing).

## UX improvements

- [x] Font family: Done as of Jul 3, 2026
- [ ] Remove host your home in tab
- [ ] Add icon to Homes/Experiences
- [ ] Remove the hero title, or make it muted a bit
- [ ] Either remove label of Where and Who, or remove the icon. Looks clustered.
- [ ] Listing Card: make image square
- [ ] ListingCard: Rearrange the grey fonts. Looks clustered.
- [ ] ListingCard: Refine the heart icon, make it dimmer, and no need to hover to red.
- [ ] Add favicon
- [ ] Add Where in search, can assume api is ready.
