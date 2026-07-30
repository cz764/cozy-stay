import { ListingCardSkeleton } from "../ListingCard/ListingCardSkeleton";

const gridClassName =
  "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

export default function ListingGridSkeleton() {
  return (
    <div className={gridClassName}>
      {Array.from({ length: 8 }, (_, i) => (
        <ListingCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
