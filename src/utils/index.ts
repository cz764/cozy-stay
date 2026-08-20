import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ListingCardFieldsFragment } from "@/gql/graphql";
import type { Listing } from "@/data/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Maps a `ListingCardFields` node onto the UI's `Listing` shape. */
export function toListing(node: ListingCardFieldsFragment): Listing {
  return {
    // BigInt and numeric arrive as strings over GraphQL; the UI type keeps
    // id a string and rating a number.
    id: String(node.id),
    title: node.title,
    location: node.location,
    image: node.listingImagesCollection?.edges[0]?.node.url ?? "",
    pricePerNight: node.pricePerNight,
    rating: Number(node.rating),
    reviewCount: node.reviewCount,
    maxGuests: node.maxGuests,
    amenities: {
      laundry: node.laundry,
      petsFriendly: node.petsFriendly,
      ac: node.ac,
    },
  };
}
