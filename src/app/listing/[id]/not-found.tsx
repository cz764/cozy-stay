import Link from "next/link";

import { getT } from "@/i18n/server";

export default async function ListingNotFound() {
  const t = await getT();

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">{t("listing.notFoundTitle")}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("listing.notFoundBody")}
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("listing.browseAll")}
      </Link>
    </div>
  );
}
