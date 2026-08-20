import { AirVent, PawPrint, WashingMachine } from "lucide-react";

import type { ListingDetail } from "@/data/types";

interface AmenitiesProps {
  amenities: ListingDetail["amenities"];
}

export function Amenities({ amenities }: AmenitiesProps) {
  const available = [
    amenities.laundry && { icon: WashingMachine, label: "Laundry" },
    amenities.petsFriendly && { icon: PawPrint, label: "Pets welcome" },
    amenities.ac && { icon: AirVent, label: "Air conditioning" },
  ].filter((amenity) => amenity !== false);

  if (available.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-foreground">
        What this place offers
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {available.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-foreground"
          >
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
