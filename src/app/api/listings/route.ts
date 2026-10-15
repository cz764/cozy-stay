import { NextRequest, NextResponse } from "next/server";

import { fetchListings } from "../server";

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

function readCount(value: string | null) {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
}
