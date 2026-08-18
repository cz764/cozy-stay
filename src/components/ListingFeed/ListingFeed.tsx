"use client";

import { useCallback, useState } from "react";

import { fetchListings } from "@/app/api";
import { DEFAULT_LIMIT } from "@/data/constants";
import { Listing, ListingQuery, ListingsPage } from "@/data/types";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "../ListingGrid/ListingGrid";
import ListingGridSkeleton from "../ListingGrid/ListingGridSkeleton";

interface ListingFeedProps {
  /** Server-rendered first page — this component never refetch it. */
  initialPage: ListingsPage;
  query: ListingQuery;
}

/**
 * Owns the accumulated listings and appends to them as the user scrolls.
 *
 * Pagination depth lives here, not in the URL: appending via the router would
 * re-run the server component and re-render every card on every scroll. The
 * trade-off is that a refresh resets to the top — see the README.
 */
export default function ListingFeed({ initialPage, query }: ListingFeedProps) {
  const [items, setItems] = useState<Listing[]>(initialPage.listings);
  const [cursor, setCursor] = useState<string | null>(initialPage.endCursor);
  const [hasMore, setHasMore] = useState(initialPage.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { location, guests } = query;

  /**
   * No cancellation guard is needed: nothing this sets is a dependency of the
   * sentinel below, so it can't tear itself down mid-request, and React 19
   * no-ops a setState that lands after unmount.
   *
   * Memoized because `observeSentinel` depends on it — an unstable identity
   * would rebuild the observer on every render.
   */
  const loadNextPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextPage = await fetchListings({
        location,
        guests,
        after: cursor ?? undefined,
        first: DEFAULT_LIMIT,
      });
      setItems((previous) => [...previous, ...nextPage.listings]);
      setCursor(nextPage.endCursor);
      setHasMore(nextPage.hasNextPage);
    } catch (ex) {
      console.error(ex);
      setError(ex instanceof Error ? ex.message : "Could not load more stays.");
    } finally {
      setIsLoading(false);
    }
  }, [location, guests, cursor]);

  /**
   * Callback ref on the sentinel. React 19 runs the returned cleanup when the
   * node unmounts or this callback's identity changes, so no `useEffect` is
   * involved — and no `hasMore`/`error` guard either, since `renderFooter`
   * already only mounts the sentinel when there is a next page to fetch.
   *
   * The page cursor flows in through `loadNextPage`, so each rebuild closes
   * over the current position in the result set.
   */
  const observeSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          // Disconnect immediately so a burst of intersections during a fast
          // scroll can't fire two requests for the same offset.
          observer.disconnect();
          void loadNextPage();
        },
        // Start fetching before the sentinel is actually visible, so the next
        // page usually lands before the user reaches the bottom.
        { rootMargin: "200px" },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [loadNextPage],
  );

  /** The states below the grid are mutually exclusive — first match wins. */
  const renderFooter = () => {
    if (error) {
      return (
        <div className="mt-8 rounded-2xl border border-dashed py-10 text-center">
          <p className="font-medium text-foreground">{error}</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => setError(null)}
          >
            Try again
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="mt-8">
          <ListingGridSkeleton count={DEFAULT_LIMIT} />
        </div>
      );
    }

    if (hasMore) {
      return <div ref={observeSentinel} aria-hidden="true" />;
    }

    if (items.length === 0) return null;

    return (
      <p className="mt-10 text-center text-sm text-muted-foreground">
        You&rsquo;ve seen all {items.length} stays.
      </p>
    );
  };

  return (
    <>
      <ListingGrid listings={items} />

      {/* Stays mounted in every state — a live region only announces changes
          that happen while it is already in the DOM. */}
      <div aria-live="polite" className="sr-only">
        {isLoading ? "Loading more stays" : ""}
      </div>

      {renderFooter()}
    </>
  );
}
