import { useCustomization } from "@/context/CustomizationContext";
import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function RoomEnvironment() {
  const { scene } = useThree();
  const dirLight1 = useRef();
  const dirLight2 = useRef();
  const { step } = useCustomization();

  useEffect(() => {
    if (dirLight1.current)
      scene.add(
        new THREE.DirectionalLightHelper(dirLight1.current, 2, 0xff0000)
      );
    if (dirLight2.current)
      scene.add(
        new THREE.DirectionalLightHelper(dirLight2.current, 2, 0x0000ff)
      );
  }, [scene]);

  return (
    <>
      <SoftShadows size={50} samples={42} rings={26} />
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <group rotation={[-0.4, 0, 0]}>
        <directionalLight
          // ref={dirLight1}
          position={[-5, 10, 5]}
          intensity={3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0005}
          shadow-normalBias={0.05}
        />
        <directionalLight
          //   ref={dirLight2}
          position={[5, 10, 5]}
          intensity={3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0005}
          shadow-normalBias={0.05}
        />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.6} />
      </mesh>

      <OrbitControls
        target={[-1.1, -0.1, 0]}
        enablePan
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        enableRotate={false}
      />
    </>
  );
}

export default RoomEnvironment;
