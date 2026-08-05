import { NextRequest, NextResponse } from "next/server";

import { fetchListings } from "../server";

/**
 * HTTP wrapper over the stubbed backend in `../server` — the wire the client
 * feed pulls on as the user scrolls. The server-rendered first page calls that
 * module directly instead, so this handler is the client's path only.
 *
 * Its job is the HTTP edge and nothing else: parse the query string, delegate,
 * serialize. Defaults and bounds belong to the backend, not to this adapter.
 * Point it at a real service later and the client contract is unchanged.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = await fetchListings({
    location: searchParams.get("location") ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
    skip: readCount(searchParams.get("skip")),
    limit: readCount(searchParams.get("limit")),
  });

  // Simulate network latency so the infinite-scroll loading state is exercised.
  // Only on this path: the first page is rendered server-side and shouldn't be
  // held up. Remove once a real backend is in place.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json(page);
}

/**
 * Reads a non-negative integer param. Anything missing or malformed returns
 * `undefined` and falls through to the backend's own default.
 */
function readCount(value: string | null) {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}
