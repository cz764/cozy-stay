import type { ListingQuery, ListingsPage } from "@/lib/types";

export interface FetchListingsParams extends ListingQuery {
  /** Offset into the filtered results. Callers pass `items.length`. */
  skip?: number;
  limit?: number;
}

/**
 * Typed client for `GET /api/listings` — the browser's path to the backend.
 *
 * Server components use the identically-shaped `fetchListings` in `./server`,
 * which reaches the data directly. A server component can't use this one: it
 * has no origin to resolve a relative URL against, and the absolute URL it
 * would have to build (`VERCEL_URL`) is the deployment domain that Vercel's
 * Deployment Protection answers with an HTML login page.
 *
 * Same-origin from the browser, so the relative URL is all this needs. When
 * the API moves to its own host, only `./server` changes — this stays pointed
 * at the route handler, which proxies.
 */
export async function fetchListings({
  location,
  guests,
  skip,
  limit,
}: FetchListingsParams): Promise<ListingsPage> {
  const params = new URLSearchParams();

  if (location) {
    params.set("location", location);
  }

  if (guests) {
    params.set("guests", guests);
  }

  if (skip !== undefined) {
    params.set("skip", String(skip));
  }

  if (limit !== undefined) {
    params.set("limit", String(limit));
  }

  const res = await fetch(`/api/listings?${params}`);
  if (!res.ok)
    throw new Error(`Error fetching stays, status code: ${res.status}`);

  const data: ListingsPage = await res.json();

  return data;
}
