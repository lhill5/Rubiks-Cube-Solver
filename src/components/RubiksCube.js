import React, { useRef, useState, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useGesture } from "react-use-gesture";
import { useSpring, animated } from "@react-spring/three";

import Cube from "./Cube";
import Side from "./Side";

function RubiksCube(props) {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [x_offset, y_offset] = [0.45, -0.75];
  const prevSide = useRef(null);
  const [sideUpdate, toggleSideUpdate] = useState(false);
  const [cubeUpdate, toggleCubeUpdate] = useState(false);

  /* cube refs */
  const RubiksCubeRef = useRef(null);
  const cubesRef = useRef(null);
  const frontGroup = useRef(null);
  const backGroup = useRef(null);
  const leftGroup = useRef(null);
  const rightGroup = useRef(null);
  const upGroup = useRef(null);
  const downGroup = useRef(null);
  const unusedGroup = useRef(null);

  const groups = {
    F: frontGroup,
    B: backGroup,
    L: leftGroup,
    R: rightGroup,
    U: upGroup,
    D: downGroup,
  };

  const [isAnimationDone, setAnimationDone] = useState(true); // no animation running initially
  const [xPos, yPos] = [useRef(x_offset), useRef(y_offset)];

  const [cubeSpring, setCube] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [x_offset, y_offset, 0],
    config: { friction: 20 },
  }));

  // add correct cubes to active side
  useEffect(() => {
    if (props.activeSide === "") return;

    if (prevSide.current) {
      let prev_group = groups[prevSide.current[0]];
      let cubes = prev_group.current.children.slice();

      for (let cube of cubes) {
        prev_group.current.remove(cube);
        cubesRef.current.add(cube);
      }
    }
    prevSide.current = props.activeSide;

    toggleSideUpdate(!sideUpdate);
  }, [props.activeSide]);

  // const [frontSpring, setFront] = useSpring(() => ({
  //   scale: [1, 1, 1],
  //   position: [0, 0, 0],
  //   rotation: [0, 0, 0],
  //   config: { friction: 20 },
  // }));

  // currently not used, rotates entire cube 90 degrees CCW
  // useEffect(() => {
  //   if (isMounted.current) {
  //     setCube({
  //       rotation: [
  //         cubeRef.current.rotation.x,
  //         cubeRef.current.rotation.y + Math.PI / 2,
  //         0,
  //       ],
  //     });
  //     yPos.current += Math.PI / 2;
  //   } else {
  //     isMounted.current = true;
  //   }
  // }, []);

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      setCube({
        rotation: [y / aspect + xPos.current, x / aspect + yPos.current, 0],
      });
    },
    onHover: ({ hovering }) =>
      setCube({ scale: hovering ? [1.05, 1.05, 1.05] : [1, 1, 1] }),
  });

  return (
    <animated.group ref={RubiksCubeRef} {...cubeSpring} {...bind()} {...props}>
      <Side
        side="F"
        group={frontGroup}
        cubesRef={cubesRef}
        sideUpdate={sideUpdate}
        toggleCubeUpdate={() => toggleCubeUpdate(!cubeUpdate)}
        activeSide={props.activeSide}
        numRotations={props.numRotations}
        resetRotation={props.resetRotation}
        isAnimationDone={isAnimationDone}
        setAnimationDone={(state) => {
          setAnimationDone(state);
        }}
      />

      <Side
        side="B"
        group={backGroup}
        cubesRef={cubesRef}
        sideUpdate={sideUpdate}
        toggleCubeUpdate={() => toggleCubeUpdate(!cubeUpdate)}
        activeSide={props.activeSide}
        numRotations={props.numRotations}
        resetRotation={props.resetRotation}
        isAnimationDone={isAnimationDone}
        setAnimationDone={(state) => {
          setAnimationDone(state);
        }}
      />

      <Side
        side="L"
        group={leftGroup}
        cubesRef={cubesRef}
        sideUpdate={sideUpdate}
        toggleCubeUpdate={() => toggleCubeUpdate(!cubeUpdate)}
        activeSide={props.activeSide}
        numRotations={props.numRotations}
        resetRotation={props.resetRotation}
        isAnimationDone={isAnimationDone}
        setAnimationDone={(state) => {
          setAnimationDone(state);
        }}
      />

      <Side
        side="R"
        group={rightGroup}
        cubesRef={cubesRef}
        sideUpdate={sideUpdate}
        toggleCubeUpdate={() => toggleCubeUpdate(!cubeUpdate)}
        activeSide={props.activeSide}
        numRotations={props.numRotations}
        resetRotation={props.resetRotation}
        isAnimationDone={isAnimationDone}
        setAnimationDone={(state) => {
          setAnimationDone(state);
        }}
      />

      <Side
        side="U"
        group={upGroup}
        cubesRef={cubesRef}
        sideUpdate={sideUpdate}
        toggleCubeUpdate={() => toggleCubeUpdate(!cubeUpdate)}
        activeSide={props.activeSide}
        numRotations={props.numRotations}
        resetRotation={props.resetRotation}
        isAnimationDone={isAnimationDone}
        setAnimationDone={(state) => {
          setAnimationDone(state);
        }}
      />

      <Side
        side="D"
        group={downGroup}
        cubesRef={cubesRef}
        sideUpdate={sideUpdate}
        toggleCubeUpdate={() => toggleCubeUpdate(!cubeUpdate)}
        activeSide={props.activeSide}
        numRotations={props.numRotations}
        resetRotation={props.resetRotation}
        isAnimationDone={isAnimationDone}
        setAnimationDone={(state) => {
          setAnimationDone(state);
        }}
      />

      <animated.group ref={cubesRef}>
        {/* F0 */}
        <Cube
          position={{ x: 0, y: 0, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F1, U7, L3 */}
        <Cube
          position={{ x: -1, y: 1, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F2, U6 */}
        <Cube
          position={{ x: 0, y: 1, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F3, U5, R1 */}
        <Cube
          position={{ x: 1, y: 1, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F4, R8 */}
        <Cube
          position={{ x: 1, y: 0, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F5, R7, D3 */}
        <Cube
          position={{ x: 1, y: -1, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F6, D2 */}
        <Cube
          position={{ x: 0, y: -1, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F7, D1, L5 */}
        <Cube
          position={{ x: -1, y: -1, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* F8, L4 */}
        <Cube
          position={{ x: -1, y: 0, z: 1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>

        {/* B0 */}
        <Cube
          position={{ x: 0, y: 0, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B1, U3, R3 */}
        <Cube
          position={{ x: 1, y: 1, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B2, U2 */}
        <Cube
          position={{ x: 0, y: 1, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B3, U1, L1 */}
        <Cube
          position={{ x: -1, y: 1, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B4, L8 */}
        <Cube
          position={{ x: -1, y: 0, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B5, L7, D7 */}
        <Cube
          position={{ x: -1, y: -1, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B6, D6 */}
        <Cube
          position={{ x: 0, y: -1, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B7, R5, D5 */}
        <Cube
          position={{ x: 1, y: -1, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* B8, R4 */}
        <Cube
          position={{ x: 1, y: 0, z: -1 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* D0 */}
        <Cube
          position={{ x: 0, y: -1, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* L6, D8 */}
        <Cube
          position={{ x: -1, y: -1, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* R6, D4 */}
        <Cube
          position={{ x: 1, y: -1, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* L0 */}
        <Cube
          position={{ x: -1, y: 0, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* C0 */}
        <Cube
          position={{ x: 0, y: 0, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* R0 */}
        <Cube
          position={{ x: 1, y: 0, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* L2, U8 */}
        <Cube
          position={{ x: -1, y: 1, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* U0 */}
        <Cube
          position={{ x: 0, y: 1, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
        {/* R2, U4 */}
        <Cube
          position={{ x: 1, y: 1, z: 0 }}
          activeSide={props.activeSide}
          numRotations={props.numRotations.current}
          isAnimationDone={isAnimationDone}
          cubeUpdate={cubeUpdate}
        ></Cube>
      </animated.group>

      <group ref={unusedGroup}></group>
    </animated.group>
  );
}

export default RubiksCube;
