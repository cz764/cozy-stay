import { fetchListings } from "@/app/api/server";
import { DEFAULT_LIMIT } from "@/data/constants";
import { ListingQuery, ListingsPage } from "@/data/types";
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
      <FeaturedStaysHeader
        location={location}
        guests={guests}
        total={firstPage.totalCount}
      />
      <ListingFeed initialPage={firstPage} query={{ location, guests }} />
    </>
  );
}
