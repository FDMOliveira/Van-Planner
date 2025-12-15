import { all3DModelsQuery } from "../../lib/queries";
import { sanityFetch } from "../../lib/sanity.fetch";
import RootSection from "@/components/RootSection";

export default async function Page() {
  const models = await sanityFetch(all3DModelsQuery, {});
  return models && <RootSection models={models} />;
}
