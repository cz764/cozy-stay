import type { Listing, ListingQuery } from "@/lib/types";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export async function fetchListings(query: ListingQuery): Promise<Listing[]> {
  const params = new URLSearchParams();
  const { location, guests } = query;

  if (location) {
    params.set("location", location);
  }

  if (guests) {
    params.set("guests", guests);
  }

  const res = await fetch(`${getBaseUrl()}/api/listings?${params}`);
  if (!res.ok)
    throw new Error(`Error fetching stays, status code: ${res.status}`);

  const data: { listings: Listing[] } = await res.json();
  return data.listings;
}
