import { NextRequest, NextResponse } from "next/server";

import { listings } from "@/lib/data";
import { DEFAULT_LIMIT, MAX_LIMIT } from "@/lib/pagination";

/** Reads a non-negative integer param, falling back on anything malformed. */
function readCount(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

/**
 * Stubbed "search stays" endpoint. Filtering and pagination happen here so the
 * frontend treats it like a real backend — swap the in-memory work for a
 * DB/service call later and the client code stays the same.
 *
 * Offset pagination is safe here because the catalog is static. Against a
 * mutable dataset an insert would shift every later offset and duplicate items
 * across requests; that's the point to move to cursors.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const location = (searchParams.get("location") ?? "").toLowerCase();
  const guestsParam = searchParams.get("guests") ?? "";
  const guests =
    guestsParam !== "" && Number.isFinite(Number(guestsParam))
      ? Number(guestsParam)
      : undefined;

  const skip = readCount(searchParams.get("skip"), 0);
  const limit = Math.min(
    Math.max(readCount(searchParams.get("limit"), DEFAULT_LIMIT), 1),
    MAX_LIMIT,
  );

  const matches = listings.filter((listing) => {
    const matchesLocation =
      !location ||
      listing.location.toLowerCase().includes(location) ||
      listing.title.toLowerCase().includes(location);
    const matchesGuests = guests === undefined || listing.maxGuests >= guests;
    return matchesLocation && matchesGuests;
  });

  const results = matches.slice(skip, skip + limit);

  // Simulate network latency so loading states are exercised. Remove once a
  // real backend is in place.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({
    listings: results,
    total: matches.length,
    skip,
    limit,
    // Computed server-side so the client never has to know the arithmetic —
    // it keeps meaning the same thing if this moves to cursor pagination.
    hasMore: skip + results.length < matches.length,
  });
}
