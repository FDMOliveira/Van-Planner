export const all3DModelsQuery = `
  *[_type == "threeDModel"]{
    _id,
    title,
    brand,
    description,
    
    "modelFileUrl": gltfModel.gltf.asset->url,
    "modelFileName": gltfModel.gltf.asset->originalFilename,
    
    "binFileUrl": gltfModel.bin.asset->url,
    "binFileName": gltfModel.bin.asset->originalFilename,

  }
`;
