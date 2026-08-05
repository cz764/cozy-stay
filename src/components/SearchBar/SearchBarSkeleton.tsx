import { MapPin, Users, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SearchField,
  SearchDivider,
} from "@/components/SearchField/SearchField";

/**
 * Static stand-in for `SearchBar` while it defers to the client.
 *
 * `SearchBar` calls `useSearchParams()`, which can't be resolved during static
 * prerendering — without a Suspense boundary that bailout propagates to the
 * whole route and breaks the build of the statically generated `/_not-found`
 * page. This is the fallback for that boundary.
 *
 * It deliberately reuses `SearchField`, `SearchDivider` and `Button` and
 * repeats the same form classes, so it occupies identical space and swaps in
 * without layout shift. With no query params the inputs are empty either way,
 * so the swap is invisible; with `?location=…` the fields fill in on hydration.
 */
export function SearchBarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full flex-col items-stretch gap-2 rounded-2xl border bg-background p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full sm:pl-4"
    >
      <SearchField icon={<MapPin className="size-4" />} label="Where">
        {/* readOnly rather than disabled: keeps the control focusable and
            avoids the dimmed disabled styling flashing before hydration. */}
        <input
          type="text"
          readOnly
          placeholder="Search destinations"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </SearchField>

      <SearchDivider />

      <SearchField icon={<Users className="size-4" />} label="Who">
        <input
          type="number"
          readOnly
          placeholder="How many guests"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </SearchField>

      <Button type="button" size="lg" className="rounded-full sm:size-12 sm:p-0">
        <Search className="size-5" />
        <span className="sm:hidden">Search</span>
      </Button>
    </div>
  );
}
