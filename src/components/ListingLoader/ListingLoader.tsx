import { fetchListings } from "@/app/api";
import { ListingQuery } from "@/lib/types";
import FeaturedStaysHeader from "../FeaturedStaysHeader/FeaturedStaysHeader";
import { ListingGrid } from "../ListingGrid/ListingGrid";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";

interface ListingLoaderProps {
  searchParams: ListingQuery;
}

export default async function ListingLoader({
  searchParams,
}: ListingLoaderProps) {
  const { location, guests } = searchParams;
  let listings;

  try {
    listings = await fetchListings(searchParams);
  } catch (ex) {
    console.error(ex);
    const message =
      ex instanceof Error ? ex.message : "Something went wrong loading stays.";
    return <ErrorDisplay error={message} />;
  }

  return (
    <>
      <FeaturedStaysHeader
        location={location}
        guests={guests}
        total={listings.length}
      />
      <ListingGrid listings={listings} />
    </>
  );
}
