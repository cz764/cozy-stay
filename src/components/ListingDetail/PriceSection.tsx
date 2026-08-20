interface PriceSectionProps {
  pricePerNight: number;
  maxGuests: number;
}

/** The price card — sticky beside the description on desktop. */
export function PriceSection({ pricePerNight, maxGuests }: PriceSectionProps) {
  return (
    <aside
      aria-label="Price"
      className="w-full shrink-0 rounded-2xl border p-6 md:sticky md:top-6 md:w-72"
    >
      <p className="text-xl font-semibold text-foreground">
        ${pricePerNight}
        <span className="text-sm font-normal text-muted-foreground"> night</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Sleeps up to {maxGuests} {maxGuests === 1 ? "guest" : "guests"}
      </p>
    </aside>
  );
}
