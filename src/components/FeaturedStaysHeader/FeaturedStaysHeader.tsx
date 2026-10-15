import { getT } from "@/i18n/server";

interface FeaturedStaysHeaderProps {
  location: string | undefined;
  guests: string | undefined;
  total: number;
}

export default async function FeaturedStaysHeader({
  location,
  guests,
  total,
}: FeaturedStaysHeaderProps) {
  const t = await getT();
  const filtered = Boolean(location || guests);

  // The count only reads naturally when the user asked for something specific.
  const stays =
    filtered || total === 1
      ? t("featured.count", { count: total })
      : t("featured.all");
  const where = location ? t("featured.inLocation", { location }) : "";
  const who = guests ? t("featured.upToGuests", { count: guests }) : "";

  return (
    <h2 className="mb-6 text-xl font-semibold">{`${stays}${where}${who}`}</h2>
  );
}
