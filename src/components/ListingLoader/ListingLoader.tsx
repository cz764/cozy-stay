import { fetchListings } from "@/app/api";
import { DEFAULT_LIMIT } from "@/lib/pagination";
import { ListingQuery, ListingsPage } from "@/lib/types";
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
  let firstPage: ListingsPage;

  try {
    firstPage = await fetchListings({ ...searchParams, limit: DEFAULT_LIMIT });
  } catch (ex) {
    console.error(ex);
    const message =
      ex instanceof Error ? ex.message : "Something went wrong loading stays.";
    return <ErrorDisplay error={message} />;
  }

  return (
    <>
      {/* `total` counts every match, not just this page — using the page
          length here would under-report once results exceed the limit. */}
      <FeaturedStaysHeader
        location={location}
        guests={guests}
        total={firstPage.total}
      />
      <ListingGrid listings={firstPage.listings} />
    </>
  );
}
