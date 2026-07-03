import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ListingGrid } from "@/components/ListingGrid";
import { listings } from "@/lib/data";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const location = typeof params.location === "string" ? params.location : "";
  const guestsParam = typeof params.guests === "string" ? params.guests : "";
  const guests =
    Number.isFinite(Number(guestsParam)) && guestsParam !== ""
      ? Number(guestsParam)
      : undefined;

  const results = listings.filter((listing) => {
    const matchesLocation =
      !location ||
      listing.location.toLowerCase().includes(location.toLowerCase()) ||
      listing.title.toLowerCase().includes(location.toLowerCase());
    const matchesGuests = guests === undefined || listing.maxGuests >= guests;
    return matchesLocation && matchesGuests;
  });

  const isSearching = location !== "" || guests !== undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="font-brand text-3xl tracking-tight sm:text-4xl">
            Escape and relax
          </h1>

          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-xl font-semibold">
          {isSearching
            ? `${results.length} ${results.length === 1 ? "stay" : "stays"}${
                location ? ` in “${location}”` : ""
              }`
            : "Featured stays"}
        </h2>
        <ListingGrid listings={results} />
      </main>
    </div>
  );
}
