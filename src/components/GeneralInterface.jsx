"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useCustomization } from "../context/CustomizationContext";
import { useEffect } from "react";
import RoomEnvironment from "./RoomEnvironment";
import VanSlider from "./VanSlider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VanInfoText from "./VanInfoText";
import TopTooltip from "./TopTooltip";
import VanConfigPanel from "./configuration/VanConfigPanel";

function GeneralInterface() {
  const {
    modelsAvailable,
    selectedModels,
    setSelectedModels,
    setDraggingModel,
    setNewModelId,
    setIsMoving,
    setIsTransformingModel,
    vans,
  } = useCustomization();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  function isPositionOccupied(newPos, existingModels, minDistance = 1) {
    return existingModels.some((model) => {
      const [x, , z] = model.position;
      const dx = x - newPos.x;
      const dz = z - newPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance < minDistance;
    });
  }

  function findFreePosition(existingModels, minDistance = 1) {
    const startX = 0;
    const startZ = 0;

    const maxRadius = 10;
    const step = 2;

    for (let radius = 0; radius <= maxRadius; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (Math.abs(dx) !== radius && Math.abs(dz) !== radius) continue;

          const candidate = { x: startX + dx * step, z: startZ + dz * step };

          if (!isPositionOccupied(candidate, existingModels, minDistance)) {
            return candidate;
          }
        }
      }
    }

    return { x: startX, z: startZ };
  }
  const handleDrop = (e) => {
    e.preventDefault();
    const modelName = e.dataTransfer.getData("modelName");
    const model = modelsAvailable?.find((m) => m.name === modelName);

    if (model) {
      const freePos = findFreePosition(selectedModels);
      const newModel = {
        ...structuredClone(model),
        id: crypto.randomUUID(),
        position: [freePos.x, 0, freePos.z],
      };

      setSelectedModels((prev) => [...prev, newModel]);
      setNewModelId(newModel.id);
      setDraggingModel(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    vans.length > 0 && (
      <>
        <TopTooltip />
        <VanInfoText />
        <VanConfigPanel />
        <div className="border-outside"></div>
        <div
          className="relative w-full h-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Canvas
            shadows
            camera={{
              position: [6, 2.5, 6],
              fov: 50,
              rotation: [0, 0, 0],
            }}
            onCreated={({ gl }) => {
              gl.ntoneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.8;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.physicallyCorrectLights = true;
            }}
            onPointerMissed={() => {
              setIsTransformingModel(null);
              setIsMoving(false);
            }}
          >
            <RoomEnvironment />
            <VanSlider />
          </Canvas>
        </div>
      </>
    )
  );
}

export default GeneralInterface;
