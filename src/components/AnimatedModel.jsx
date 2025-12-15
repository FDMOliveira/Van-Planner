import { useState, useEffect, useRef } from "react";
import {
  getModelObject,
  useCustomization,
} from "@/context/CustomizationContext";
import gsap from "gsap";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function AnimatedModel({ model, texture, animate }) {
  const {
    setIsTransformingModel,
    isTransformingModel,
    updateModel,
    roomBounds,
    isMoving,
    setIsMoving,
  } = useCustomization();
  const [modelSize, setModelSize] = useState({ w: 0, d: 0 });
  const wrapperRef = useRef();
  const { camera, raycaster, mouse, scene, size } = useThree();
  const [ModelComponent, setModelComponent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const Comp = await getModelObject(model.name);
      if (isMounted) setModelComponent(() => Comp);
    }
    load();
    return () => (isMounted = false);
  }, [model.name]);

  useEffect(() => {
    if (animate && wrapperRef.current) {
      wrapperRef.current.scale.set(0, 0, 0);
      gsap.to(wrapperRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: "back.out(2)",
      });
    }
  }, [ModelComponent, animate]);

  function getMousePositionOnGround(ndcX, ndcY) {
    raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();

    raycaster.ray.intersectPlane(plane, intersectPoint);

    return intersectPoint;
  }

  function handleClick(e) {
    e.stopPropagation();
    if (isTransformingModel === model.id) {
      // If already selected, unselect it
      setIsTransformingModel(null);
    } else {
      setIsTransformingModel(model.id);
    }
  }

  function isInsideRoom(position) {
    if (!wrapperRef.current) return false;

    const box = new THREE.Box3().setFromObject(wrapperRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    let halfWidth = size.x / 2;
    let halfDepth = size.z / 2;
    return (
      position.x >= roomBounds.min.x + halfWidth &&
      position.x <= roomBounds.max.x - halfWidth &&
      position.z >= roomBounds.min.z + halfDepth &&
      position.z <= roomBounds.max.z - halfDepth
    );
  }

  useFrame(() => {
    if (isTransformingModel === model.id && wrapperRef.current) {
      const pos = getMousePositionOnGround(mouse.x, mouse.y);
      if (pos && isInsideRoom(pos)) {
        wrapperRef.current.position.set(pos.x, 0, pos.z);
        console.log(model.id);
        updateModel(model.id, { position: [pos.x, 0, pos.z] });
      }
    }
  });
  if (!ModelComponent) return null;

  return (
    <group
      ref={wrapperRef}
      position={model.position || [0, 0, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor =
          isTransformingModel === model.id ? "grabbing" : "grab";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
      }}
    >
      <ModelComponent texture={texture} />
    </group>
  );
}

export default AnimatedModel;
