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

export interface ListingQuery {
  location?: string;
  guests?: string;
}

/**
 * One slice of search results, shaped like a paginated backend response.
 *
 * Offset-based (`skip`/`limit`) rather than page-based so a single request can
 * cover an arbitrary range — the client derives `skip` from how many items it
 * already holds, with no page counter to keep in sync.
 */
export interface ListingsPage {
  listings: Listing[];
  /** Matches across every page for this query, not just the returned slice. */
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
}
