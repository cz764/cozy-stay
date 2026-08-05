import { DEFAULT_LIMIT } from "@/lib/pagination";
import { ListingCardSkeleton } from "../ListingCard/ListingCardSkeleton";

const gridClassName =
  "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

interface ListingGridSkeletonProps {
  /** Defaults to a full page so the placeholder matches what replaces it. */
  count?: number;
}

export default function ListingGridSkeleton({
  count = DEFAULT_LIMIT,
}: ListingGridSkeletonProps) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <ListingCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
