import type { Metadata } from "next";

import WishlistFeed from "@/components/WishlistFeed/WishlistFeed";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.pageTitle", { page: t("wishlist.title") }) };
}

export default async function WishlistPage() {
  const t = await getT();

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">
        {t("wishlist.title")}
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        {t("wishlist.deviceNote")}
      </p>
      <WishlistFeed />
    </>
  );
}
