import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchListingById } from "@/app/api/server";
import ListingDetail from "@/components/ListingDetail/ListingDetail";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

/**
 * `generateMetadata` and the page both need the listing; the GraphQL call is
 * a POST, which Next's fetch memoization skips, so dedupe it here instead.
 */
const getListing = cache(fetchListingById);

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  // The page streams behind loading.tsx, so a missing listing can't change
  // the committed 200 status — Next marks the not-found render noindex.
  if (!listing) return { title: "Stay not found — cozystays" };

  return {
    title: `${listing.title} — cozystays`,
    description: `${listing.title} in ${listing.location}, from $${listing.pricePerNight} a night.`,
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return <ListingDetail listing={listing} />;
}
