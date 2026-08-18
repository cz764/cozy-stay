import type { ListingQuery, ListingsPage } from "@/data/types";

export interface FetchListingsParams extends ListingQuery {
  /**
   * Opaque cursor of the last row already held — the previous page's
   * `endCursor`. Omit for the first page.
   */
  after?: string;
  /** Page size. */
  first?: number;
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
 * Same-origin from the browser, so the relative URL is all this needs. The
 * route handler proxies to `./server`, keeping Supabase credentials and the
 * GraphQL documents out of the browser bundle.
 */
export async function fetchListings({
  location,
  guests,
  after,
  first,
}: FetchListingsParams): Promise<ListingsPage> {
  const params = new URLSearchParams();

  if (location) {
    params.set("location", location);
  }

  if (guests) {
    params.set("guests", guests);
  }

  if (after !== undefined) {
    params.set("after", after);
  }

  if (first !== undefined) {
    params.set("first", String(first));
  }

  const res = await fetch(`/api/listings?${params}`);
  if (!res.ok)
    throw new Error(`Error fetching stays, status code: ${res.status}`);

  const data: ListingsPage = await res.json();

  return data;
}
