import { client } from "./sanity.client";

export async function sanityFetch<QueryResponse>(
  query: string,
  params: Record<string, any> = {}
): Promise<QueryResponse> {
  return client.fetch(query, params);
}
