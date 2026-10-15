import { getT } from "@/i18n/server";

export default async function FeaturedStaysHeaderSkeleton() {
  const t = await getT();
  return <h2 className="mb-6 text-xl font-semibold">{t("feed.searching")}</h2>;
}
