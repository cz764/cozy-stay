import { NextRequest, NextResponse } from "next/server";

import { listings } from "@/lib/data";

/**
 * Stubbed "search stays" endpoint. Filtering happens here so the frontend
 * treats it like a real backend — swap the in-memory filter for a DB/service
 * call later and the client code stays the same.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const location = (searchParams.get("location") ?? "").toLowerCase();
  const guestsParam = searchParams.get("guests") ?? "";
  const guests =
    guestsParam !== "" && Number.isFinite(Number(guestsParam))
      ? Number(guestsParam)
      : undefined;

  const results = listings.filter((listing) => {
    const matchesLocation =
      !location ||
      listing.location.toLowerCase().includes(location) ||
      listing.title.toLowerCase().includes(location);
    const matchesGuests = guests === undefined || listing.maxGuests >= guests;
    return matchesLocation && matchesGuests;
  });

  // Simulate network latency so loading states are exercised. Remove once a
  // real backend is in place.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({ listings: results });
}
