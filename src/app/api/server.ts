import { graphql } from "@/gql";
import type { ListingsFilter } from "@/gql/graphql";
import { DEFAULT_LIMIT, MAX_LIMIT } from "@/data/constants";
import type { ListingsPage } from "@/data/types";
import { executeGraphQL } from "./graphql";
import type { FetchListingsParams } from ".";

/**
 * The card projection — everything the feed renders and nothing the detail
 * page adds. The detail query will spread this same fragment so card and
 * detail can never disagree on shared fields.
 */
export const ListingCardFields = graphql(`
  fragment ListingCardFields on Listings {
    id
    title
    location
    pricePerNight
    rating
    reviewCount
    maxGuests
    laundry
    petsFriendly
    ac
    listingImagesCollection(first: 1, orderBy: [{ sortOrder: AscNullsLast }]) {
      edges {
        node {
          url
        }
      }
    }
  }
`);

const ListingFeedQuery = graphql(`
  query ListingFeed($first: Int!, $after: Cursor, $filter: ListingsFilter) {
    listingsCollection(
      first: $first
      after: $after
      filter: $filter
      orderBy: [{ id: AscNullsLast }]
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ListingCardFields
        }
      }
    }
  }
`);

/**
 * The backend client — the only place search and pagination are implemented,
 * now backed by Supabase pg_graphql. Server-side callers (`ListingLoader`, and
 * `GET /api/listings` on behalf of the client feed) both come through here.
 *
 * Server-only on purpose: keeps the Supabase credentials and the GraphQL
 * documents out of the browser bundle, and keeps the infinite scroll a real
 * network round trip through our own route handler.
 *
 * Defaults and bounds live here rather than at the HTTP edge: they're the
 * backend's policy. The upper bound stops a hand-crafted `?first=99999` asking
 * for the world (pg_graphql independently enforces max_rows = MAX_LIMIT).
 */
export async function fetchListings({
  location,
  guests,
  after,
  first,
}: FetchListingsParams): Promise<ListingsPage> {
  const needle = (location ?? "").trim();
  const guestCount =
    guests && Number.isFinite(Number(guests)) ? Number(guests) : undefined;

  const size = Math.min(
    Math.max(
      first !== undefined && Number.isInteger(first) ? first : DEFAULT_LIMIT,
      1,
    ),
    MAX_LIMIT,
  );

  const conditions: ListingsFilter[] = [];
  if (needle) {
    conditions.push({
      or: [
        { location: { ilike: `%${needle}%` } },
        { title: { ilike: `%${needle}%` } },
      ],
    });
  }
  if (guestCount !== undefined) {
    conditions.push({ maxGuests: { gte: guestCount } });
  }

  const data = await executeGraphQL(ListingFeedQuery, {
    first: size,
    after: after ?? null,
    filter: conditions.length > 0 ? { and: conditions } : null,
  });

  const collection = data.listingsCollection;
  if (!collection) {
    throw new Error("GraphQL response is missing listingsCollection");
  }

  return {
    listings: collection.edges.map(({ node }) => ({
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
    })),
    totalCount: collection.totalCount,
    endCursor: collection.pageInfo.endCursor ?? null,
    hasNextPage: collection.pageInfo.hasNextPage,
  };
}
