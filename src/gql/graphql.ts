/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: unknown;
  lte?: unknown;
  neq?: unknown;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: unknown;
  lte?: unknown;
  neq?: unknown;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: boolean | null | undefined;
  is?: FilterIs | null | undefined;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: unknown;
  lte?: unknown;
  neq?: unknown;
};

export type FilterIs =
  | 'NOT_NULL'
  | 'NULL';

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: string | number | null | undefined;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: Array<number> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  neq?: number | null | undefined;
};

export type ListingsFilter = {
  ac?: BooleanFilter | null | undefined;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: Array<ListingsFilter> | null | undefined;
  createdAt?: DatetimeFilter | null | undefined;
  description?: StringFilter | null | undefined;
  hostAvatarUrl?: StringFilter | null | undefined;
  hostIsSuperhost?: BooleanFilter | null | undefined;
  hostJoinedYear?: IntFilter | null | undefined;
  hostName?: StringFilter | null | undefined;
  id?: BigIntFilter | null | undefined;
  laundry?: BooleanFilter | null | undefined;
  location?: StringFilter | null | undefined;
  maxGuests?: IntFilter | null | undefined;
  nodeId?: IdFilter | null | undefined;
  /** Negates a filter */
  not?: ListingsFilter | null | undefined;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: Array<ListingsFilter> | null | undefined;
  petsFriendly?: BooleanFilter | null | undefined;
  pricePerNight?: IntFilter | null | undefined;
  rating?: BigFloatFilter | null | undefined;
  reviewCount?: IntFilter | null | undefined;
  title?: StringFilter | null | undefined;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  ilike?: string | null | undefined;
  in?: Array<string> | null | undefined;
  iregex?: string | null | undefined;
  is?: FilterIs | null | undefined;
  like?: string | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
  regex?: string | null | undefined;
  startsWith?: string | null | undefined;
};

export type ListingCardFieldsFragment = { id: unknown, title: string, location: string, pricePerNight: number, rating: unknown, reviewCount: number, maxGuests: number, laundry: boolean, petsFriendly: boolean, ac: boolean, listingImagesCollection: { edges: Array<{ node: { url: string } }> } | null };

export type ListingFeedQueryVariables = Exact<{
  first: number;
  after?: unknown;
  filter?: ListingsFilter | null | undefined;
}>;


export type ListingFeedQuery = { listingsCollection: { totalCount: number, pageInfo: { hasNextPage: boolean, endCursor: string | null }, edges: Array<{ node: { id: unknown, title: string, location: string, pricePerNight: number, rating: unknown, reviewCount: number, maxGuests: number, laundry: boolean, petsFriendly: boolean, ac: boolean, listingImagesCollection: { edges: Array<{ node: { url: string } }> } | null } }> } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const ListingCardFieldsFragmentDoc = new TypedDocumentString(`
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
  listingImagesCollection(first: 1, orderBy: [{sortOrder: AscNullsLast}]) {
    edges {
      node {
        url
      }
    }
  }
}
    `, {"fragmentName":"ListingCardFields"}) as unknown as TypedDocumentString<ListingCardFieldsFragment, unknown>;
export const ListingFeedDocument = new TypedDocumentString(`
    query ListingFeed($first: Int!, $after: Cursor, $filter: ListingsFilter) {
  listingsCollection(
    first: $first
    after: $after
    filter: $filter
    orderBy: [{id: AscNullsLast}]
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
  listingImagesCollection(first: 1, orderBy: [{sortOrder: AscNullsLast}]) {
    edges {
      node {
        url
      }
    }
  }
}`) as unknown as TypedDocumentString<ListingFeedQuery, ListingFeedQueryVariables>;