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
 * One slice of search results, shaped like a Relay-style connection page.
 *
 * Cursor-based (`after`/`first`) rather than offset-based: an insert into the
 * catalog shifts every later offset and duplicates items across requests,
 * while a cursor pins the next page to the last row already seen.
 */
export interface ListingsPage {
  listings: Listing[];
  /** Matches across every page for this query, not just the returned slice. */
  totalCount: number;
  /**
   * Cursor of the last row in `listings` — pass as `after` to fetch the next
   * page. Null when the page is empty.
   */
  endCursor: string | null;
  hasNextPage: boolean;
}
