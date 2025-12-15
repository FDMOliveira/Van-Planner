import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export function PlatformBed(props) {
  const { scene } = useGLTF("/models/furniture/platform_bed/platform_bed.gltf");

  const cloned = useMemo(() => scene.clone(), [scene]);

  return <primitive object={cloned} {...props} />;
}

useGLTF.preload("/models/furniture/platform_bed/platform_bed.gltf");
