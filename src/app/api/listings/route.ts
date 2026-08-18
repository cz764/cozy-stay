import { NextRequest, NextResponse } from "next/server";

import { fetchListings } from "../server";

/**
 * HTTP wrapper over the backend client in `../server` — the wire the client
 * feed pulls on as the user scrolls. The server-rendered first page calls that
 * module directly instead, so this handler is the client's path only.
 *
 * Its job is the HTTP edge and nothing else: parse the query string, delegate,
 * serialize. Defaults and bounds belong to the backend, not to this adapter.
 * The cursor is opaque — passed through untouched; the backend rejects garbage.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = await fetchListings({
    location: searchParams.get("location") ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
    after: searchParams.get("after") ?? undefined,
    first: readCount(searchParams.get("first")),
  });

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
