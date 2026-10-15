import { getT } from "@/i18n/server";

interface PriceSectionProps {
  pricePerNight: number;
  maxGuests: number;
}

export async function PriceSection({
  pricePerNight,
  maxGuests,
}: PriceSectionProps) {
  const t = await getT();

  return (
    <aside
      aria-label={t("listing.price")}
      className="w-full shrink-0 rounded-2xl border p-6 md:sticky md:top-6 md:w-72"
    >
      <p className="flex items-baseline gap-1 text-xl font-semibold text-foreground">
        ${pricePerNight}
        <span className="text-sm font-normal text-muted-foreground">
          {t("listing.night")}
        </span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("listing.sleeps", { count: maxGuests })}
      </p>
    </aside>
  );
}
