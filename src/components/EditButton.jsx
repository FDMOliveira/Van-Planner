import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useFrame, useThree } from "@react-three/fiber";

export function EditButton({ visible, position, handleOnClick }) {
  const { nodes, materials } = useGLTF("/models/cog.glb");
  const gearRef = useRef();

  useFrame((_, delta) => {
    gearRef.current.rotation.z += 3 * delta;
  });

  useEffect(() => {
    if (gearRef.current?.children?.material) {
      gearRef.current.children[0].material.alphaHash = true;
      gearRef.current.children[0].material.opacity = 0;
    }
  }, []);

  useEffect(() => {
    console.log(visible);
    if (typeof visible !== "undefined") {
      if (visible) {
        gsap.to(gearRef.current.children[0].material, {
          opacity: 1,
          duration: 0.5,
        });
      } else {
        gsap.to(gearRef.current.children[0].material, {
          opacity: 0,
          duration: 0.5,
        });
      }
    }
  }, [visible]);

  return (
    <>
      <group
        scale={1}
        rotation={[Math.PI / 2, -0.2, 0]}
        position={position}
        userData={{ edit: true, draggable: false }}
        ref={gearRef}
        onClick={handleOnClick}
      >
        <mesh scale={0.1} position={[0, 0, -0.05]}>
          <mesh geometry={nodes.Gear.geometry} material={nodes.Gear.material}>
            <meshStandardMaterial color={"#FFF"} />
          </mesh>
          <mesh
            geometry={nodes.Cube.geometry}
            material={materials["Material.001"]}
            position={[0, -0.058, 0]}
            scale={[1.155, 0.369, 1.105]}
          />
        </mesh>
      </group>
    </>
  );
}

useGLTF.preload("/models/cog.glb");
