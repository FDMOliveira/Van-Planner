import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";

const gltfCache = new Map();

export default function useSanityGLTF(modelFileUrl, binFileUrl) {
  const [patchedUrl, setPatchedUrl] = useState(null);

  useEffect(() => {
    if (!modelFileUrl) return;

    const cleanGLTF = modelFileUrl.split("?")[0];
    const cleanBin = binFileUrl?.split("?")[0] || null;
    const cacheKey = cleanGLTF + "|" + cleanBin;

    if (gltfCache.has(cacheKey)) {
      setPatchedUrl(gltfCache.get(cacheKey));
      return;
    }

    async function patch() {
      try {
        const gltfText = await fetch(cleanGLTF).then((r) => r.text());

        if (gltfText.trim().startsWith("<")) {
          console.error("Returned HTML instead of GLTF");
          return;
        }

        let json = JSON.parse(gltfText);

        // REMOVE COMPLETELY all images and textures
        json.images = [];
        json.textures = [];

        // CLEAN materials
        if (json.materials) {
          for (const mat of json.materials) {
            // Remove standard textures
            if (mat.pbrMetallicRoughness) {
              delete mat.pbrMetallicRoughness.baseColorTexture;
              delete mat.pbrMetallicRoughness.metallicRoughnessTexture;
            }

            delete mat.normalTexture;
            delete mat.occlusionTexture;
            delete mat.emissiveTexture;

            // Clean extensions
            if (mat.extensions) {
              for (const extName of Object.keys(mat.extensions)) {
                const ext = mat.extensions[extName];

                // If extension references textures → delete extension
                if (
                  ext &&
                  typeof ext === "object" &&
                  Object.values(ext).some(
                    (v) => typeof v === "object" && v.index !== undefined
                  )
                ) {
                  delete mat.extensions[extName];
                }
              }

              if (Object.keys(mat.extensions).length === 0) {
                delete mat.extensions;
              }
            }
          }
        }

        // Fix .bin reference
        if (cleanBin && json.buffers?.[0]) {
          json.buffers[0].uri = cleanBin;
        }

        const blob = new Blob([JSON.stringify(json)], {
          type: "model/gltf+json",
        });
        const blobURL = URL.createObjectURL(blob);

        gltfCache.set(cacheKey, blobURL);
        setPatchedUrl(blobURL);
      } catch (err) {
        console.error("Falha ao carregar GLTF:", err);
      }
    }

    patch();
  }, [modelFileUrl, binFileUrl]);

  if (!patchedUrl) return null;

  return useGLTF(patchedUrl);
}
