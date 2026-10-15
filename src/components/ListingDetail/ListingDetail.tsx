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

export default function ListingDetail({ listing }: ListingDetailProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <ListingHeader
        id={listing.id}
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
