"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MapPin, Users, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchField, SearchDivider } from "@/components/SearchField";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (guests) params.set("guests", guests);

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-stretch gap-2 rounded-2xl border bg-background p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full sm:pl-4"
    >
      <SearchField icon={<MapPin className="size-4" />} label="Where">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search destinations"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </SearchField>

      <SearchDivider />

      <SearchField icon={<Users className="size-4" />} label="Who">
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Add guests"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </SearchField>

      <Button
        type="submit"
        size="lg"
        className="rounded-full sm:size-12 sm:p-0"
      >
        <Search className="size-5" />
        <span className="sm:hidden">Search</span>
      </Button>
    </form>
  );
}
