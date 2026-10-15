import type { ListingQuery, ListingsPage } from "@/data/types";

export interface FetchListingsParams extends ListingQuery {
  // The previous page's endCursor; omit for the first page.
  after?: string;
  first?: number;
}

// Browser client only: server components call ./server directly.
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
