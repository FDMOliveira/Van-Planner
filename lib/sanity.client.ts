import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "4a6u6zrp",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
