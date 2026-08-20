export default function ListingLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="h-7 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-4 w-1/3 rounded bg-muted" />

      <div className="mt-4 grid gap-2 overflow-hidden rounded-2xl md:grid-cols-2">
        <div className="aspect-[4/3] bg-muted" />
        <div className="hidden grid-cols-2 gap-2 md:grid">
          <div className="aspect-[4/3] bg-muted" />
          <div className="aspect-[4/3] bg-muted" />
          <div className="aspect-[4/3] bg-muted" />
          <div className="aspect-[4/3] bg-muted" />
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-8 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="mt-3 h-3 w-full rounded bg-muted" />
          <div className="mt-2 h-3 w-full rounded bg-muted" />
          <div className="mt-2 h-3 w-3/4 rounded bg-muted" />
        </div>
        <div className="h-32 w-full shrink-0 rounded-2xl bg-muted md:w-72" />
      </div>
    </div>
  );
}
