"use client";

import { Suspense, use, useState } from "react";
import Link from "next/link";

import { fetchListings } from "@/app/api";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/ListingGrid/ListingGrid";
import ListingGridSkeleton from "@/components/ListingGrid/ListingGridSkeleton";
import { DEFAULT_LIMIT, MAX_LIMIT } from "@/data/constants";
import type { Listing } from "@/data/types";
import { useHydrated, useWishlist } from "@/hooks/useWishlist";
import { useT } from "@/i18n/client";

type WishlistResult = { listings: Listing[] } | { error: true };

async function loadWishlist(ids: readonly string[]): Promise<WishlistResult> {
  try {
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += MAX_LIMIT) {
      chunks.push([...ids.slice(i, i + MAX_LIMIT)]);
    }
    const pages = await Promise.all(
      chunks.map((chunk) => fetchListings({ ids: chunk, first: chunk.length })),
    );
    const byId = new Map(
      pages.flatMap((page) => page.listings).map((item) => [item.id, item]),
    );
    // The API orders by id; the wishlist shows most recently saved first.
    return {
      listings: ids
        .map((id) => byId.get(id))
        .filter((item): item is Listing => item !== undefined),
    };
  } catch (ex) {
    console.error(ex);
    return { error: true };
  }
}

// `use()` needs the same promise across renders, so cache per request key.
const requests = new Map<string, Promise<WishlistResult>>();

function getWishlistRequest(key: string, ids: readonly string[]) {
  let request = requests.get(key);
  if (!request) {
    request = loadWishlist(ids);
    requests.set(key, request);
  }
  return request;
}

export default function WishlistFeed() {
  const hydrated = useHydrated();
  const { ids } = useWishlist();

  if (!hydrated) return <ListingGridSkeleton count={DEFAULT_LIMIT} />;
  if (ids.length === 0) return <EmptyWishlist />;

  return (
    <Suspense
      fallback={<ListingGridSkeleton count={Math.min(ids.length, MAX_LIMIT)} />}
    >
      <WishlistResults />
    </Suspense>
  );
}

function WishlistResults() {
  const t = useT();
  const { ids } = useWishlist();
  // Snapshot on mount: un-saving on this page keeps the card visible (with an
  // empty heart) so the click can be undone; the list refreshes on next visit.
  const [snapshot] = useState(ids);
  const [attempt, setAttempt] = useState(0);

  const result = use(
    getWishlistRequest(`${attempt}:${snapshot.join(",")}`, snapshot),
  );

  if ("error" in result) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        <p className="font-medium text-foreground">{t("wishlist.loadError")}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setAttempt((count) => count + 1)}
        >
          {t("wishlist.tryAgain")}
        </Button>
      </div>
    );
  }

  if (result.listings.length === 0) return <EmptyWishlist />;

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        {t("wishlist.count", { count: ids.length })}
      </p>
      <ListingGrid listings={result.listings} />
    </>
  );
}

function EmptyWishlist() {
  const t = useT();

  return (
    <div className="rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">{t("wishlist.emptyTitle")}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("wishlist.emptyBody")}
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("wishlist.browse")}
      </Link>
    </div>
  );
}
