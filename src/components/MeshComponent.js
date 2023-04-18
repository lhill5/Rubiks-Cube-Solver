import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGesture } from "react-use-gesture";
import { useSpring, animated } from "@react-spring/three";
import { Vector3 } from "three";

function delay(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec));
}

const MeshComponent = () => {
  const [toggle, setToggle] = useState(true);
  const group1 = useRef(null);
  const group2 = useRef(null);
  const cube5 = useRef(null);

  const [cubePositions, setCubePositions] = useState([
    { x: -1, y: -1, z: 1 },
    { x: 0, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: -1, y: 0, z: 1 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: -1, y: 1, z: 1 },
    { x: 0, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
  ]);

  const onButtonClick = () => {
    let cubes = null;
    let group = null;
    let other_group = null;
    if (toggle) {
      group = group1;
      other_group = group2;
    } else {
      group = group2;
      other_group = group1;
    }

    cubes = group.current.children.slice();
    if (cubes.length) {
      const cubeToRemove1 = cubes.find(
        (c) => c.position.x === -1 && c.position.y === -1
      );
      const cubeToRemove2 = cubes.find(
        (c) => c.position.x === 0 && c.position.y === -1
      );
      const cubeToRemove3 = cubes.find(
        (c) => c.position.x === 1 && c.position.y === -1
      );

      group.current.remove(cubeToRemove1);
      group.current.remove(cubeToRemove2);
      group.current.remove(cubeToRemove3);

      other_group.current.add(cubeToRemove1);
      other_group.current.add(cubeToRemove2);
      other_group.current.add(cubeToRemove3);
    }

    // Only toggle the state without moving black cubes to other_group
    setToggle(!toggle);
  };

  const rotate = () => {
    try {
      group1.current.rotation.z -= Math.PI / 2;
      let cubes = group1.current.children;
      cubes.forEach((cube, i) => {
        setCubePositions((prevState) => {
          const updatedArray = [...prevState];
          updatedArray[i] = getFrontRotation(Object.values(prevState[i]));
          return updatedArray;
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      group1.current.rotation.z = 0;
    }
  };

  const getFrontRotation = (position) => {
    const rotated_position = getRotatedPosition(position);
    rotated_position.splice(2, 0, 1);

    const [x, y, z] = rotated_position;
    const obj_position = { x, y, z };
    return obj_position;
  };

  const getRotatedPosition = (position3d) => {
    // handles front/right/up rotations

    let position = position3d.slice();
    position = position.slice(0, 2);

    const lookup = {
      "-1,1": [1, 1],
      "0,1": [1, 0],
      "1,1": [1, -1],
      "1,0": [0, -1],
      "1,-1": [-1, -1],
      "0,-1": [-1, 0],
      "-1,-1": [-1, 1],
      "-1,0": [0, 1],
      "0,0": [0, 0],
    };

    const str_position = position.join(",");
    const rotated_position = lookup[str_position];
    const rotated_prime_position = rotated_position.map((num) => -num);

    return rotated_position;
  };

  useEffect(() => {
    console.log(group2.current?.children);
  }, [group2.current?.children.length]);

  // useFrame(() => {
  //   console.log("");
  // });

  return (
    <>
      <group ref={group1} onClick={rotate}>
        <Cube position={cubePositions[0]} color="black"></Cube>
        <Cube position={cubePositions[1]} color="black"></Cube>
        <Cube position={cubePositions[2]} color="black"></Cube>
        <Cube position={cubePositions[3]} color="red"></Cube>
        <Cube position={cubePositions[4]} color="red"></Cube>
        <Cube position={cubePositions[5]} color="red"></Cube>
        <Cube position={cubePositions[6]} color="blue"></Cube>
        <Cube position={cubePositions[7]} color="blue"></Cube>
        <Cube position={cubePositions[8]} color="blue"></Cube>
      </group>

      <group ref={group2}></group>

      <mesh position={[-1, 3, 0]} ref={cube5} onClick={onButtonClick}>
        <boxBufferGeometry />
        <meshStandardMaterial color="black" />
      </mesh>
    </>
  );
};

const Cube = (props) => {
  const cubeRef = useRef(null);

  return (
    <mesh
      position={[props.position.x, props.position.y, props.position.z]}
      ref={cubeRef}
    >
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
};

export default MeshComponent;
