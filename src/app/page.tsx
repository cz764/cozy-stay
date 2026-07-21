"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ListingGrid } from "@/components/ListingGrid";
import { Listing } from "@/lib/types";

export default function Home() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const guests = searchParams.get("guests") ?? "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchListings() {
      setIsLoading(true);
      setError(null);

      const query = new URLSearchParams();
      if (location) query.set("location", location);
      if (guests) query.set("guests", guests);

      try {
        const res = await fetch(`/api/listings?${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to load stays");

        const data: { listings: Listing[] } = await res.json();
        setListings(data.listings);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchListings();
    return () => controller.abort();
  }, [location, guests]);

  const isSearching = location !== "" || guests !== "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto max-w-7xl px-6 pt-2 pb-8">
          <div className="mx-auto max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <main className="mx-auto w-[90vw] max-w-[1920px] px-6 py-10">
        <h2 className="mb-6 text-xl font-semibold">
          {isLoading
            ? "Searching stays…"
            : isSearching
              ? `${listings.length} ${listings.length === 1 ? "stay" : "stays"}${
                  location ? ` in “${location}”` : ""
                } ${guests ? `up to ${guests} guests` : ""}`
              : "Featured stays"}
        </h2>

        {error ? (
          <div className="rounded-2xl border border-dashed py-16 text-center">
            <p className="font-medium text-foreground">{error}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again in a moment.
            </p>
          </div>
        ) : (
          <ListingGrid listings={listings} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
