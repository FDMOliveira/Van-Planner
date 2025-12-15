import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function scaleToVanWidth(object, van) {
  object.scale.set(1, 1, 1);
  object.updateMatrixWorld(true);

  const boxObj = new THREE.Box3().setFromObject(object);
  const sizeObj = new THREE.Vector3();
  boxObj.getSize(sizeObj);

  const boxVan = new THREE.Box3().setFromObject(van);
  const sizeVan = new THREE.Vector3();
  boxVan.getSize(sizeVan);

  // add 12% margin
  const scaleX = (sizeVan.x * 0.83) / sizeObj.x;

  const ratioY = sizeObj.y / sizeObj.x;
  const ratioZ = sizeObj.z / sizeObj.x;

  object.scale.x = scaleX;
  object.scale.y = scaleX * ratioY;
  object.scale.z = scaleX * ratioZ;

  object.updateMatrixWorld(true);
}

export default function Furniture({ type, model, van }) {
  const ref = useRef();
  const [floor, setFloor] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    queueMicrotask(() => {
      if (ref.current.children.length > 0) {
        setReady(true);
      }
    });
  }, [model]);

  useEffect(() => {
    if (!van) return;

    const floor = van.getObjectByName("Chassis");

    if (!floor) {
      console.warn("⚠️ Chassis não encontrado na van!");
      return;
    }

    const box = new THREE.Box3().setFromObject(floor);

    const floorY = box.min.y;
    const floorX = box.min.x;
    const floorZ = box.min.z;

    setFloor({ x: floorX, y: floorY, z: floorZ });
  }, [van]);

  useEffect(() => {
    if (!ready || !van || !floor || !ref.current) return;

    const vanBox = new THREE.Box3().setFromObject(van);

    const pos = new THREE.Vector3();

    if (type === "bed") {
      scaleToVanWidth(ref.current, van);
      pos.z = floor.z + 0.2;
      pos.y = floor.y;
      pos.x = (vanBox.min.x + vanBox.max.x) / 2 - 0.8;
    }

    ref.current.position.copy(pos);
  }, [ready, floor, van, type]);

  return <group ref={ref}>{model}</group>;
}
