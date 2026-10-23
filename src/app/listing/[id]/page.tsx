import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchListingById } from "@/app/api/server";
import ListingDetail from "@/components/ListingDetail/ListingDetail";
import { getT } from "@/i18n/server";

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
  const [listing, t] = await Promise.all([getListing(id), getT()]);
  // The page streams behind loading.tsx, so a missing listing can't change
  // the committed 200 status – Next marks the not-found render noindex.
  if (!listing) return { title: t("meta.notFoundTitle") };

  return {
    title: t("meta.pageTitle", { page: listing.title }),
    description: t("meta.listingDescription", {
      title: listing.title,
      location: listing.location,
      price: listing.pricePerNight,
    }),
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return <ListingDetail listing={listing} />;
}
