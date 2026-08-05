import type { ListingQuery, ListingsPage } from "@/lib/types";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export interface FetchListingsParams extends ListingQuery {
  /** Offset into the filtered results. Callers pass `items.length`. */
  skip?: number;
  limit?: number;
}

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

  const res = await fetch(`${getBaseUrl()}/api/listings?${params}`);
  if (!res.ok)
    throw new Error(`Error fetching stays, status code: ${res.status}`);

  const data = await res.json();

  return data;
}
