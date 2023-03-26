import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGesture } from "react-use-gesture";
import { useSpring, animated } from "@react-spring/three";

function MeshComponent() {
  const meshRef = useRef();
  const group1 = useRef();
  const group2 = useRef();

  const [parent, setParent] = useState("group1");

  useFrame(() => {
    group1.current.rotation.x += 0.1;
    group1.current.rotation.y += 0.1;
  });

  return (
    <>
      <group ref={group1}>
        <mesh position={[-1, 0, 0]}>
          <boxBufferGeometry />
          <meshStandardMaterial color="red" />
        </mesh>

        <mesh
          ref={meshRef}
          position={[0, 0, 0]}
          onClick={() => setParent(parent === "group1" ? "group2" : "group1")}
          parent={parent === "group1" ? group1.current : group2.current}
        >
          <boxBufferGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>

      <group ref={group2}>
        <mesh position={[1, 0, 0]}>
          <boxBufferGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>
    </>
  );
}

export default MeshComponent;
