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

## Locale resolution

The locale is resolved once, in the proxy (`src/proxy.ts`, Next.js 16's name for middleware): a `?lg=<tag>` query parameter wins, then the `lg` cookie, then English. The proxy forwards the result in an `x-locale` request header so server components read one value instead of re-implementing the precedence, and it persists a valid `?lg=` to the cookie so a shared link becomes the visitor's preference.

A path prefix (`/fr/...`) was rejected: it would move every route under `app/[locale]/` for four languages on a UI whose data is English-only. The query parameter keeps language shareable, consistent with search state living in the URL, while the cookie makes it sticky across plain links such as listing cards.

The dialog does not navigate. It calls a server action that sets the cookie, then `router.refresh()`. A search-param navigation would only re-render the page segment; the header lives in the root layout and must re-render too, which refresh guarantees. Focus is returned to the control that opened the dialog explicitly, because the dropdown that may have opened it has unmounted by then.

## Translations without a library

Strings live in one JSON catalog per locale and are read through `t(key, vars)`. The catalog shape is typed from `en.json`, so other catalogs must match it and keys are checked at compile time. Plurals use CLDR categories selected with `Intl.PluralRules`, with `other` as the fallback form. With roughly fifty strings and no date or currency formatting yet, `next-intl` or `react-intl` would add routing opinions and bundle weight for features not in use; if rich formatting arrives, the `t()` call sites do not change.

Only UI chrome is translated. Listing content is stored in English and would need per-language columns to translate. Prices keep a literal `$` prefix rather than `Intl.NumberFormat` currency output, which would turn `$120` into `120,00 $US` in French; that is a product decision deferred until there is more than one currency.

The web fonts have no CJK glyphs. Rather than ship Noto Sans SC (which slows every build through `next/font`), the font stacks name the platform CJK faces after the web fonts, so Latin text keeps the chosen fonts and Chinese falls through per glyph. The brand tagline falls through to Kaiti to keep a handwritten feel.

## Header client islands

`Header` stays a server component. The interactive part – globe button, dropdown menu and language dialog – is one client component, `HeaderActions`, because the globe and the menu's Language item share the dialog's open state. The globe is hidden below the `sm` breakpoint, so Language is also a menu item; otherwise phones would have no way to switch.

The wordmark is rendered only through `components/Logo` so the brand mark cannot drift between pages.

## Focus ring

The `--ring` token is plum (`oklch(0.45 0.16 330)`), analogous to the coral primary rather than the primary itself. Coral was invisible as a ring on primary buttons, and a neutral grey fails over the dark photos behind the wishlist heart. Plum also keeps focus visually distinct from the destructive red used for invalid fields, which coral and its darker shades did not.

Focus is drawn through one `focus-ring` utility in `globals.css` as a two-layer ring: a 2px background-colored gap, then 2px of ring color. The gap carries the contrast on surfaces the color cannot (the coral button, dark images), so one recipe works everywhere. Components use the utility instead of repeating the ring classes, so tuning happens in one place.

## Routes before features

`/wishlist`, `/profile` and `/login` were created as real routes rendering a shared `ComingSoon` body rather than a single `/coming-soon?feature=` page. The URLs in the menu never change when the feature lands, and each route can grow its own metadata and loading state independently. `/wishlist` has since become real; the other two remain placeholders.

## Anonymous wishlist

Saved listing ids live in `localStorage` under `cozystay.wishlist`, newest first, behind `useSyncExternalStore`. The server snapshot is an empty list, so server HTML shows empty hearts and the client fills them after hydration without a mismatch; `useHydrated` lets the wishlist page show a skeleton instead of a false empty state during that window. The `storage` event keeps tabs in sync. Writes update an in-memory copy first, so a failing `localStorage` (private mode, quota) still works for the current tab.

Saving from the detail page uses the same button in an `inline` variant with visible Save/Saved text. Both variants use `aria-pressed` with a stable label.

`/wishlist` is a server page that mounts a client feed. The feed snapshots the ids on mount and fetches them through `/api/listings?ids=…` in `MAX_LIMIT` chunks, reordering the response to the saved order. Un-saving on the page leaves the card visible with an empty heart so the action can be undone; the list is correct on the next visit. The fetch uses `use()` over a cached promise inside `Suspense` rather than an effect, which keeps loading and error handling declarative; an explicit retry bumps the cache key.

The API accepts the id list as a filter rather than a separate endpoint so the location and guest filters still compose with it. Malformed ids are dropped and an empty list matches nothing, never everything.

## Email and password login

Accounts live in Supabase Auth, as the roadmap planned, with one app-owned `public.profiles` row per user created by a trigger on `auth.users`. A hand-rolled `users` table was rejected: it would need the Supabase secret key on the server to keep password hashes out of the public GraphQL API, and every later table would lose `auth.uid()` row-level security.

All auth runs server-side through `@supabase/ssr` with the publishable key, which is already server-only. The login form posts to a server action; the browser never talks to Supabase. The proxy creates a client per request and calls `getUser()` so an expiring session is refreshed and its new cookies written to the response, which server components cannot do themselves. `getUser()` rather than reading the cookie's JWT is deliberate: the cookie is client-controlled, and the call verifies the token with Supabase.

The post-login destination travels as `?next=` and is validated to a same-origin path (`/...`, not `//host`, not `/login`) on both the page and the action, so the login page cannot become an open redirect. The header's Log in link carries the current path and query so a visitor returns to the exact search they left.

Email is validated for shape only. Whether an address can receive mail is not verified anywhere; `test@test.com` is a valid account. Errors are returned from the action as a fixed code and translated on the client, so the catalog, not the action, owns the wording.

The seeded test account is inserted into `auth.users` and `auth.identities` directly rather than through the Auth API so the seed stays one re-runnable SQL file with no secret key involved.

## Accounts roadmap

The build order was reconsidered: a profile page is the signed-in user's data and has nothing to show before authentication, while an anonymous wishlist is a complete feature on its own. So: wishlist (done, anonymous), then authentication, then profile.

Authentication uses Supabase Auth through `@supabase/ssr`, kept server-side (see _Email and password login_ above). Email and password login is done; registration is next, then OAuth through a `/auth/callback` route handler.

With a session available, the wishlist moves to a `wishlists (user_id, listing_id, created_at)` table protected by row-level security on `auth.uid()`, added as a CLI migration like every schema change. On first sign-in the anonymous `localStorage` list is merged into the table and cleared. `useWishlist` keeps its `{ ids, has, toggle }` shape; only the store behind it changes, so cards and the detail header do not.

Profile follows as the smallest step: display name and avatar from the auth user's metadata, plus a link to the wishlist. It is deliberately thin until bookings exist to show.
