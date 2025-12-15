"use client";

import useSanityGLTF from "@/utils/SanityGLTF";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export default function VanModel({ modelFileUrl, binFileUrl, color }) {
  const gltf = useSanityGLTF(modelFileUrl, binFileUrl);
  const targetColor = useRef(new THREE.Color(color));
  const currentColors = useRef([]);

  const paintaBleAreas = ["Car paint", "BodyGreen", "CarPaint"];

  const hasColorChanged = useRef(false);

  useEffect(() => {
    if (!gltf?.scene) return;

    currentColors.current = [];
    gltf.scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        paintaBleAreas.includes(child.material.name)
      ) {
        child.material.color = child.material.color.clone();
        currentColors.current.push(child.material.color.clone());
      }

      if (child.isMesh && child.name === "SideDoor") {
        gsap.to(child.position, {
          x: 2,
          duration: 1,
          ease: "power2.out",
        });
      }
      if (child.name === "BackLeftDoor") {
        child.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            // clone material bceause its shared through objects
            obj.material = obj.material.clone();

            obj.material.transparent = true;
            obj.material.opacity = 0;
            obj.material.needsUpdate = true;
          }
        });
      }
    });
  }, [gltf]);

  useEffect(() => {
    if (!gltf?.scene) return;

    if (color && gltf) {
      let diff = false;
      let index = 0;
      gltf.scene.traverse((child) => {
        if (
          child.isMesh &&
          child.material &&
          paintaBleAreas.includes(child.material.name)
        ) {
          if (!child.material.color.equals(new THREE.Color(color))) {
            diff = true;
          }
          index++;
        }
      });

      if (diff) {
        targetColor.current.set(color);
        hasColorChanged.current = true;
      }
    }
  }, [color, gltf]);

  useFrame(() => {
    if (!gltf?.scene || !hasColorChanged.current) {
      return;
    }

    let index = 0;
    gltf.scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        paintaBleAreas.includes(child.material.name)
      ) {
        currentColors.current[index].lerp(targetColor.current, 0.2);
        child.material.color.copy(currentColors.current[index]);
        index++;
      }
    });
  });

  useEffect(() => {
    if (!gltf?.scene) return;

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  if (!gltf) return <group />;

  return <primitive object={gltf.scene} />;
}
