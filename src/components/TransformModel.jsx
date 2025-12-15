import { useEffect, useRef, useState } from "react";
import { useCustomization } from "../context/CustomizationContext";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function TransformModel() {
  const { setCurrentModel, setIsTransformingModel, setToolTipPos } =
    useCustomization();
  const { scene, raycaster, camera, pointer, size } = useThree();

  let transformationMode = "move";

  let objectRef = useRef(null);
  let mouseClick = new THREE.Vector2();

  useEffect(() => {
    document.body.addEventListener("keyup", handleKeyUp);
    document.body.addEventListener("pointermove", handlePointeMove);

    return () => {
      document.body.removeEventListener("keyup", handleKeyUp);
      document.body.removeEventListener("pointermove", handlePointeMove);
    };
  }, []);

  function handlePointeMove(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    let found = raycaster.intersectObjects(scene.children);

    if (found.length && found[0]?.object.parent.userData.draggable == true) {
      document.body.style.cursor = "move";
      setCurrentModel(found[0].object.parent);

      use3DTo2D(found[0].object.parent.position);
    } else {
      if (found[0]?.object.parent.parent.userData.edit !== true) {
        setCurrentModel({});
        document.body.style.cursor = "default";
      } else {
        document.body.style.cursor = "pointer";
      }
    }
  }

  useFrame(() => {
    if (!objectRef.current) return;

    dragObject();
  });

  function dragObject() {
    if (objectRef.current) {
      raycaster.setFromCamera(pointer, camera);
      const found = raycaster.intersectObjects(scene.children);

      if (found.length > 0) {
        for (let o of found) {
          // making sure only catch intersection with ground
          if (!o.object.userData.ground || o.object.userData.draggable) {
            return;
          }

          objectRef.current.position.x = o.point.x;
          objectRef.current.position.z = o.point.z;
        }
      }
    }
  }

  function handleKeyUp(e) {
    if (objectRef.current) {
      if (e.key == "q") {
        transformationMode = "move";
      } else if (e.key == "w") {
        transformationMode = "rotate";
      }
    }
  }

  function use3DTo2D(position) {
    if (!position) return;

    const vec = position.clone().project(camera);
    let toolTipoPos = {
      x: (vec.x * 0.5 + 0.5) * size.width,
      y: (1 - (vec.y * 0.5 + 0.5)) * size.height, // Invertendo Y
    };

    setToolTipPos(toolTipoPos);
  }
}

export default TransformModel;
