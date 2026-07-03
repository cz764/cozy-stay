export function ListingCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col">
      <div className="aspect-[4/3] w-full rounded-2xl bg-muted" />
      <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
      <div className="mt-2 h-3 w-2/5 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/4 rounded bg-muted" />
    </div>
  );
}
