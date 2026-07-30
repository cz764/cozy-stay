import { Suspense } from "react";
import { ListingQuery } from "@/lib/types";
import ListingLoader from "@/components/ListingLoader/ListingLoader";
import ListingLoaderSkeleton from "@/components/ListingLoader/ListingLoaderSkeleton";

interface HomeSearchParamsProps {
  searchParams: Promise<ListingQuery>;
}

export default async function Home({ searchParams }: HomeSearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  const { location, guests } = resolvedSearchParams;

  return (
    <Suspense
      key={`location:${location}-guests:${guests}`}
      fallback={<ListingLoaderSkeleton />}
    >
      <ListingLoader searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
