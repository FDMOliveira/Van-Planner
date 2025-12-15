"use client";

import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useCustomization } from "@/context/CustomizationContext";
import VanModel from "./VanModel";
import { PlatformBed } from "./models/Platform_bed";
import Furniture from "./Furniture";

export default function VanSlider() {
  const {
    vans,
    selectedVan,
    setSelectedVan,
    setVanIndex,
    setIsFadeOut,
    isFadeOut,
    setStep,
    selectedColor,
  } = useCustomization();

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndex = useRef(0);

  const vanRefs = useRef([]);
  const hitboxRefs = useRef([]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotationY = useRef(0);
  const hasUserRotation = useRef([]);
  const zoomedIndex = useRef(null);

  useEffect(() => {
    if (vans?.length > 0) {
      setCurrentIndex(0);
    }
  }, [vans]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight" && currentIndex < vans.length - 1) {
        zoomedIndex.current = null;
        prevIndex.current = currentIndex;
        setSelectedVan(null);
        setCurrentIndex((prev) => prev + 1);
      }

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        zoomedIndex.current = null;
        prevIndex.current = currentIndex;
        setSelectedVan(null);
        setCurrentIndex((prev) => prev - 1);
      }

      if (e.key === "Enter") {
        if (selectedVan === currentIndex) {
          setSelectedVan(null);
          zoomedIndex.current = null;
          hasUserRotation.current[selectedVan] = false;
        } else {
          setSelectedVan(currentIndex);
          zoomedIndex.current = currentIndex;
          hasUserRotation.current[currentIndex] = false;
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, selectedVan, vans.length]);

  // Fade
  useEffect(() => {
    setIsFadeOut(true);
  }, [currentIndex]);

  useEffect(() => {
    if (isFadeOut) {
      const timer = setTimeout(() => {
        setVanIndex(currentIndex);
        setIsFadeOut(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isFadeOut, currentIndex]);

  useFrame(() => {
    const direction = currentIndex > prevIndex.current ? 1 : -1;
    const orderedIndices =
      direction === 1
        ? [...vans.keys()].sort((a, b) => b - a)
        : [...vans.keys()].sort((a, b) => a - b);

    orderedIndices.forEach((i, order) => {
      const van = vanRefs.current[i];
      if (!van) return;

      const targetX = (i - currentIndex) * 16;
      van.position.x += (targetX - van.position.x) * 0.1 * (1 - order * 0.1);

      // Zoom
      const targetScale = selectedVan === i ? 1.2 : 1.0;
      van.scale.x += (targetScale - van.scale.x) * 0.08;
      van.scale.y += (targetScale - van.scale.y) * 0.08;
      van.scale.z += (targetScale - van.scale.z) * 0.08;

      // Rotação automática
      if (!(isDragging.current && i === currentIndex)) {
        if (hasUserRotation.current[i]) return;

        const targetRotationY = selectedVan === i ? -(Math.PI / 4) : 0;
        van.rotation.y += (targetRotationY - van.rotation.y) * 0.08;
      }
    });
  });

  // Step (0/1)
  useEffect(() => {
    setStep(selectedVan > -1 ? 1 : 0);
  }, [selectedVan]);

  return (
    <>
      {vans.map((van, i) => (
        <group
          key={van._id}
          ref={(el) => {
            if (el) {
              vanRefs.current[i] = el;
              if (!el.positionInitialized) {
                el.position.set(i * 16, 0, 0);
                el.positionInitialized = true;
              }
            }
          }}
        >
          <VanModel
            modelFileUrl={van.modelFileUrl}
            binFileUrl={van.binFileUrl}
            color={selectedVan === i ? selectedColor : null}
          />

          <Furniture
            type="bed"
            model={<PlatformBed />}
            van={vanRefs.current[i]}
          />
        </group>
      ))}

      {vans.map((_, i) => (
        <mesh
          key={`hitbox-${i}`}
          ref={(el) => (hitboxRefs.current[i] = el)}
          position={[i * 16 + 1, 1, 0]}
          onPointerDown={(e) => {
            if (i !== currentIndex) return;
            e.stopPropagation();
            isDragging.current = true;
            startX.current = e.clientX;
            const current = vanRefs.current[currentIndex];
            startRotationY.current = current?.rotation.y || 0;
            e.target.setPointerCapture?.(e.pointerId);
            document.body.style.cursor = "grabbing";
          }}
          onPointerMove={(e) => {
            if (!isDragging.current || i !== currentIndex) return;
            e.stopPropagation();
            const deltaX = e.clientX - startX.current;
            const rotationDelta = deltaX * 0.01;
            const current = vanRefs.current[currentIndex];
            if (current) {
              current.rotation.y = startRotationY.current + rotationDelta;
              hasUserRotation.current[currentIndex] = true;
            }
          }}
          onPointerUp={(e) => {
            if (i !== currentIndex) return;
            isDragging.current = false;
            e.target.releasePointerCapture?.(e.pointerId);
            document.body.style.cursor = "auto";
          }}
          onPointerLeave={() => {
            isDragging.current = false;
            document.body.style.cursor = "auto";
          }}
          onPointerCancel={() => {
            isDragging.current = false;
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[6, 3, 5]} />
          <meshBasicMaterial opacity={0} transparent depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}
