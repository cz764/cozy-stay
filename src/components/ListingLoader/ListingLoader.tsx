import { fetchListings } from "@/app/api/server";
import { DEFAULT_LIMIT } from "@/lib/pagination";
import { ListingQuery, ListingsPage } from "@/lib/types";
import FeaturedStaysHeader from "../FeaturedStaysHeader/FeaturedStaysHeader";
import ListingFeed from "../ListingFeed/ListingFeed";
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
    firstPage = await fetchListings({ ...searchParams, first: DEFAULT_LIMIT });
  } catch (ex) {
    console.error(ex);
    const message =
      ex instanceof Error ? ex.message : "Something went wrong loading stays.";
    return <ErrorDisplay error={message} />;
  }

  return (
    <>
      {/* `totalCount` counts every match, not just this page — using the page
          length here would under-report once results exceed the limit. */}
      <FeaturedStaysHeader
        location={location}
        guests={guests}
        total={firstPage.totalCount}
      />
      {/* Server-rendered first page is handed to the client feed, which owns
          every page appended after it. */}
      <ListingFeed initialPage={firstPage} query={{ location, guests }} />
    </>
  );
}
