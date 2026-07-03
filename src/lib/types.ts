export interface Listing {
  id: string;
  title: string;
  location: string;
  image: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  /** Filter facets — wired into the filter sidebar in a later step. */
  amenities: {
    laundry: boolean;
    petsFriendly: boolean;
    ac: boolean;
  };
}
