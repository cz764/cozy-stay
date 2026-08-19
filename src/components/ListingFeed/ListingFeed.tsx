"use client";

import { useCallback, useState } from "react";

import { fetchListings } from "@/app/api";
import { AUTO_LOAD_PAGES, DEFAULT_LIMIT } from "@/data/constants";
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
  /** Sentinel-triggered fetches since the last explicit "Load more" click. */
  const [autoLoads, setAutoLoads] = useState(0);
  /** Written on every fetch transition; read only by the sr-only live region. */
  const [announcement, setAnnouncement] = useState("");

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
    setAnnouncement("Loading more stays");
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
      // The running total keeps consecutive announcements distinct — a live
      // region only speaks when its text actually changes, so a repeated
      // "24 more stays loaded" would be silent after the first page.
      const total = items.length + nextPage.listings.length;
      setAnnouncement(
        nextPage.hasNextPage
          ? `${nextPage.listings.length} more stays loaded, ${total} shown.`
          : `You've seen all ${total} stays.`,
      );
    } catch (ex) {
      console.error(ex);
      const message =
        ex instanceof Error ? ex.message : "Could not load more stays.";
      setError(message);
      setAnnouncement(message);
    } finally {
      setIsLoading(false);
    }
    // items.length changes exactly when cursor does, so including it adds no
    // extra identity churn.
  }, [location, guests, cursor, items.length]);

  /**
   * Callback ref on the sentinel. React 19 runs the returned cleanup when the
   * node unmounts or this callback's identity changes, so no `useEffect` is
   * involved — and no `hasMore`/`error` guard either, since `renderFooter`
   * already only mounts the sentinel when there is a next page to fetch and
   * the auto-load budget isn't spent.
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
          setAutoLoads((count) => count + 1);
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
      // After AUTO_LOAD_PAGES sentinel fetches, pause behind a button so the
      // feed can't be doom-scrolled — a click buys another auto-load run.
      if (autoLoads >= AUTO_LOAD_PAGES) {
        return (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => {
                setAutoLoads(0);
                void loadNextPage();
              }}
            >
              Load more stays
            </Button>
          </div>
        );
      }
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
        {announcement}
      </div>

      {renderFooter()}
    </>
  );
}
