import { listings } from "@/lib/data";
import { DEFAULT_LIMIT, MAX_LIMIT } from "@/lib/pagination";
import type { ListingsPage } from "@/lib/types";
import type { FetchListingsParams } from ".";

/**
 * The stubbed backend itself — the only place search and pagination are
 * implemented. Server-side callers (`ListingLoader`, and `GET /api/listings`
 * on behalf of the client feed) both come through here.
 *
 * Mirrors the signature of the browser client in `./index`, so this is the one
 * line that changes when a real service exists: the body becomes a `fetch` of
 * `process.env.API_BASE_URL` and no call site moves.
 *
 * Server-only on purpose. Reaching the mock data from a server component by
 * fetching our own route handler would send the request out through the public
 * edge network and back — where Vercel's Deployment Protection redirects the
 * `VERCEL_URL` deployment domain to an SSO login page, so the "JSON" that came
 * back was HTML. Keeping this out of the client graph also keeps `lib/data`
 * out of the browser bundle, which is what makes the infinite scroll a real
 * network round trip rather than a local array slice.
 */
export async function fetchListings({
  location,
  guests,
  skip,
  limit,
}: FetchListingsParams): Promise<ListingsPage> {
  const needle = (location ?? "").toLowerCase();
  const guestCount =
    guests && Number.isFinite(Number(guests)) ? Number(guests) : undefined;

  // Defaults and bounds live here rather than at the HTTP edge: they're the
  // backend's policy, and they should survive the move to a real one. The
  // upper bound stops a hand-crafted `?limit=99999` asking for the world.
  const offset =
    skip !== undefined && Number.isInteger(skip) && skip >= 0 ? skip : 0;
  const size = Math.min(
    Math.max(
      limit !== undefined && Number.isInteger(limit) ? limit : DEFAULT_LIMIT,
      1,
    ),
    MAX_LIMIT,
  );

  const matches = listings.filter((listing) => {
    const matchesLocation =
      !needle ||
      listing.location.toLowerCase().includes(needle) ||
      listing.title.toLowerCase().includes(needle);
    const matchesGuests =
      guestCount === undefined || listing.maxGuests >= guestCount;
    return matchesLocation && matchesGuests;
  });

  // Offset pagination is safe here because the catalog is static. Against a
  // mutable dataset an insert would shift every later offset and duplicate
  // items across requests; that's the point to move to cursors.
  const results = matches.slice(offset, offset + size);

  return {
    listings: results,
    /** Matches across every page for this query, not just this slice. */
    total: matches.length,
    skip: offset,
    limit: size,
    // Computed here so the client never has to know the arithmetic — it keeps
    // meaning the same thing if this moves to cursor pagination.
    hasMore: offset + results.length < matches.length,
  };
}
