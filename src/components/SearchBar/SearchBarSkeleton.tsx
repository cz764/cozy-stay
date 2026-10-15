import { MapPin, Users, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SearchField,
  SearchDivider,
} from "@/components/SearchField/SearchField";
import { getT } from "@/i18n/server";

// useSearchParams in SearchBar requires a Suspense fallback during prerendering.
export async function SearchBarSkeleton() {
  const t = await getT();

  return (
    <div
      aria-hidden="true"
      className="flex w-full flex-col items-stretch gap-2 rounded-2xl border bg-background p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full sm:pl-4"
    >
      <SearchField
        icon={<MapPin className="size-4" />}
        label={t("search.where")}
      >
        {/* readOnly rather than disabled: keeps the control focusable and
            avoids the dimmed disabled styling flashing before hydration. */}
        <input
          type="text"
          readOnly
          placeholder={t("search.wherePlaceholder")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </SearchField>

      <SearchDivider />

      <SearchField icon={<Users className="size-4" />} label={t("search.who")}>
        <input
          type="number"
          readOnly
          placeholder={t("search.whoPlaceholder")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </SearchField>

      <Button
        type="button"
        size="lg"
        className="rounded-full sm:size-12 sm:p-0"
      >
        <Search className="size-5" />
        <span className="sm:hidden">{t("search.submit")}</span>
      </Button>
    </div>
  );
}
