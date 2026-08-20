import type { ListingDetail as ListingDetailData } from "@/data/types";
import { ListingHeader } from "./ListingHeader";
import { Gallery } from "./Gallery";
import { HomeDescription } from "./HomeDescription";
import { Amenities } from "./Amenities";
import { Host } from "./Host";
import { PriceSection } from "./PriceSection";

interface ListingDetailProps {
  listing: ListingDetailData;
}

/**
 * Layout shell for the detail page: header, gallery, then description and
 * price side by side. Purely presentational — data loading stays in the page.
 *
 * Deliberately not `"use client"`: nothing here holds state or handles events,
 * so it renders entirely on the server and ships no component JS. The first
 * interactive piece (a gallery lightbox, a reserve flow) should become its own
 * client component rather than converting this shell.
 */
export default function ListingDetail({ listing }: ListingDetailProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <ListingHeader
        title={listing.title}
        location={listing.location}
        rating={listing.rating}
        reviewCount={listing.reviewCount}
      />

      <Gallery listing={listing} />

      <div className="mt-8 flex flex-col-reverse gap-8 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <HomeDescription description={listing.description} />
          <Amenities amenities={listing.amenities} />
          <Host host={listing.host} />
        </div>

        <PriceSection
          pricePerNight={listing.pricePerNight}
          maxGuests={listing.maxGuests}
        />
      </div>
    </div>
  );
}
