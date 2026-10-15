# Architecture decisions

These decisions describe the existing implementation, recorded during code cleanup.

## Server data access and browser pagination

Server components call `src/app/api/server.ts` directly. The browser fetches subsequent pages through `/api/listings`, which delegates to the same module. This keeps backend configuration and GraphQL documents on the server and avoids server requests to a deployment URL that may be behind deployment protection. Page-size defaults and bounds live in the backend module so both entry points enforce the same policy.

## Cursor pagination and client state

Pagination uses opaque cursors with a stable ID ordering. This avoids the offset shifts caused by inserting rows into the catalog between requests. Search filters live in the URL; appended pages live in `ListingFeed` state. Updating the router for every appended page would rerun server rendering. The tradeoff is that refreshing resets the accumulated feed.

The server cannot infer the viewport, so the initial page uses a fixed size that fills the widest grid. This over-fetches on narrow screens in exchange for avoiding another request to fill a wide viewport. Automatic loading pauses after `AUTO_LOAD_PAGES` and requires an explicit “Load more stays” click to continue.

## Card rendering and image loading

Cards are memoized because appending a page preserves the object identities of existing listings. The grid prioritizes images in the widest first row so the largest visible image loads eagerly at every viewport. Narrow screens preload some images below the first row as a tradeoff.

## Server rendering boundaries

The listing detail shell stays a server component. Future interactive sections can introduce their own client boundaries without shipping the static shell as client JavaScript.

`SearchBar` reads `useSearchParams` inside a Suspense boundary so static prerendering can use `SearchBarSkeleton`. The fallback matches the form's layout to avoid a layout shift during hydration.

The listing route shares a React-cached lookup between `generateMetadata` and the page because the GraphQL POST is not covered by Next.js fetch memoization. If the route has already streamed its loading state, a missing listing cannot change the committed HTTP status; Next.js marks the not-found render as noindex.
