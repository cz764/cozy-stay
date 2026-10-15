"use client";

import { useCallback, useState } from "react";

import { fetchListings } from "@/app/api";
import { AUTO_LOAD_PAGES, DEFAULT_LIMIT } from "@/data/constants";
import { Listing, ListingQuery, ListingsPage } from "@/data/types";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "../ListingGrid/ListingGrid";
import ListingGridSkeleton from "../ListingGrid/ListingGridSkeleton";

interface ListingFeedProps {
  initialPage: ListingsPage;
  query: ListingQuery;
}

export default function ListingFeed({ initialPage, query }: ListingFeedProps) {
  const [items, setItems] = useState<Listing[]>(initialPage.listings);
  const [cursor, setCursor] = useState<string | null>(initialPage.endCursor);
  const [hasMore, setHasMore] = useState(initialPage.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Automatic loads since the last explicit Load more click.
  const [autoLoads, setAutoLoads] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const { location, guests } = query;

  // Keep this callback stable: observeSentinel depends on its identity.
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
      // Include the total so consecutive live-region announcements have distinct text.
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
  }, [location, guests, cursor, items.length]);

  // React 19 runs ref cleanup on unmount or identity changes; renderFooter controls observation.
  const observeSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          // Disconnect before fetching to prevent duplicate requests from rapid intersections.
          observer.disconnect();
          setAutoLoads((count) => count + 1);
          void loadNextPage();
        },
        { rootMargin: "200px" },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [loadNextPage],
  );

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
