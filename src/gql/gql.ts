/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment ListingCardFields on Listings {\n    id\n    title\n    location\n    pricePerNight\n    rating\n    reviewCount\n    maxGuests\n    laundry\n    petsFriendly\n    ac\n    listingImagesCollection(first: 1, orderBy: [{ sortOrder: AscNullsLast }]) {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n  }\n": typeof types.ListingCardFieldsFragmentDoc,
    "\n  query ListingDetail($id: BigInt!) {\n    listingsCollection(first: 1, filter: { id: { eq: $id } }) {\n      edges {\n        node {\n          ...ListingCardFields\n          description\n          hostName\n          hostAvatarUrl\n          hostIsSuperhost\n          hostJoinedYear\n          # Aliased: the spread fragment already selects this collection with\n          # first: 1, and un-aliased re-selection with different arguments\n          # would be a field conflict.\n          gallery: listingImagesCollection(\n            orderBy: [{ sortOrder: AscNullsLast }]\n          ) {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ListingDetailDocument,
    "\n  query ListingFeed($first: Int!, $after: Cursor, $filter: ListingsFilter) {\n    listingsCollection(\n      first: $first\n      after: $after\n      filter: $filter\n      orderBy: [{ id: AscNullsLast }]\n    ) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...ListingCardFields\n        }\n      }\n    }\n  }\n": typeof types.ListingFeedDocument,
};
const documents: Documents = {
    "\n  fragment ListingCardFields on Listings {\n    id\n    title\n    location\n    pricePerNight\n    rating\n    reviewCount\n    maxGuests\n    laundry\n    petsFriendly\n    ac\n    listingImagesCollection(first: 1, orderBy: [{ sortOrder: AscNullsLast }]) {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n  }\n": types.ListingCardFieldsFragmentDoc,
    "\n  query ListingDetail($id: BigInt!) {\n    listingsCollection(first: 1, filter: { id: { eq: $id } }) {\n      edges {\n        node {\n          ...ListingCardFields\n          description\n          hostName\n          hostAvatarUrl\n          hostIsSuperhost\n          hostJoinedYear\n          # Aliased: the spread fragment already selects this collection with\n          # first: 1, and un-aliased re-selection with different arguments\n          # would be a field conflict.\n          gallery: listingImagesCollection(\n            orderBy: [{ sortOrder: AscNullsLast }]\n          ) {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ListingDetailDocument,
    "\n  query ListingFeed($first: Int!, $after: Cursor, $filter: ListingsFilter) {\n    listingsCollection(\n      first: $first\n      after: $after\n      filter: $filter\n      orderBy: [{ id: AscNullsLast }]\n    ) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...ListingCardFields\n        }\n      }\n    }\n  }\n": types.ListingFeedDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListingCardFields on Listings {\n    id\n    title\n    location\n    pricePerNight\n    rating\n    reviewCount\n    maxGuests\n    laundry\n    petsFriendly\n    ac\n    listingImagesCollection(first: 1, orderBy: [{ sortOrder: AscNullsLast }]) {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ListingCardFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingDetail($id: BigInt!) {\n    listingsCollection(first: 1, filter: { id: { eq: $id } }) {\n      edges {\n        node {\n          ...ListingCardFields\n          description\n          hostName\n          hostAvatarUrl\n          hostIsSuperhost\n          hostJoinedYear\n          # Aliased: the spread fragment already selects this collection with\n          # first: 1, and un-aliased re-selection with different arguments\n          # would be a field conflict.\n          gallery: listingImagesCollection(\n            orderBy: [{ sortOrder: AscNullsLast }]\n          ) {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ListingDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingFeed($first: Int!, $after: Cursor, $filter: ListingsFilter) {\n    listingsCollection(\n      first: $first\n      after: $after\n      filter: $filter\n      orderBy: [{ id: AscNullsLast }]\n    ) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...ListingCardFields\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ListingFeedDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
