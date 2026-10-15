export interface Listing {
  id: string;
  title: string;
  location: string;
  image: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  amenities: {
    laundry: boolean;
    petsFriendly: boolean;
    ac: boolean;
  };
}

export interface ListingDetail extends Listing {
  description: string;
  // Includes the cover image.
  images: string[];
  host: {
    name: string;
    avatarUrl: string;
    isSuperhost: boolean;
    joinedYear: number;
  };
}

export interface ListingQuery {
  location?: string;
  guests?: string;
}

export interface ListingsPage {
  listings: Listing[];
  // All matches for the query, including pages not yet loaded.
  totalCount: number;
  // Pass the last row's cursor as after; null for an empty page.
  endCursor: string | null;
  hasNextPage: boolean;
}
