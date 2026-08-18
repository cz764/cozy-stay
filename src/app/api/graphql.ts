import type { TypedDocumentString } from "@/gql/graphql";

/**
 * Minimal GraphQL-over-fetch executor for the Supabase pg_graphql endpoint.
 * Server-only, like everything that touches the backend directly — the env
 * vars are deliberately not NEXT_PUBLIC so this can't leak into the client
 * bundle by accident.
 */
export async function executeGraphQL<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set (see .env.local)",
    );
  }

  const res = await fetch(`${url}/graphql/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key },
    body: JSON.stringify({ query: query.toString(), variables }),
    // The catalog changes out from under the deployment; never serve a page of
    // listings from Next's fetch cache.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed with status ${res.status}`);
  }

  const { data, errors } = (await res.json()) as {
    data: TResult | null;
    errors?: { message: string }[];
  };

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }
  if (data == null) {
    throw new Error("GraphQL response contained no data");
  }

  return data;
}
