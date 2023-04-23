import React, { useRef, forwardRef, useState, useEffect } from "react";
import { animated } from "@react-spring/three";
import { Vector3 } from "three";

const getColor = (side, coord, blankColor, faceColor) => {
  if (["F", "R", "U"].includes(side)) {
    if (coord === 1) return faceColor;
    else return blankColor;
  } else {
    if (coord === -1) return faceColor;
    else return blankColor;
  }
};

const Cube = (props) => {
  const cubeRef = useRef(null);
  const cube_position = useRef(props.position);
  const isFirstRender = useRef(true);

  const { x, y, z } = props.position;
  const blankColor = "#212121";

  const [cubeColors, setCubeColors] = useState({
    R: getColor("R", x, blankColor, "#b71234"),
    L: getColor("L", x, blankColor, "#ff5800"),
    U: getColor("U", y, blankColor, "#ffffff"),
    D: getColor("D", y, blankColor, "#ffd500"),
    F: getColor("F", z, blankColor, "#009b48"),
    B: getColor("B", z, blankColor, "#0046ad"),
  });

  const isCubeOnActiveSide = () => {
    if (props.activeSide === "F" && cube_position.current.z === 1) return true;
    else if (props.activeSide === "B" && cube_position.current.z === -1)
      return true;
    else if (props.activeSide === "L" && cube_position.current.x === -1)
      return true;
    else if (props.activeSide === "R" && cube_position.current.x === 1)
      return true;
    else if (props.activeSide === "U" && cube_position.current.y === 1)
      return true;
    else if (props.activeSide === "D" && cube_position.current.y === -1)
      return true;
    return false;
  };

  const sideToIndex = {
    F: { L: 0, D: 1, R: 2, U: 3 },
    B: { L: 0, U: 1, R: 2, D: 3 },
    L: { F: 0, U: 1, B: 2, D: 3 },
    R: { F: 0, D: 1, B: 2, U: 3 },
    U: { F: 0, R: 1, B: 2, L: 3 },
    D: { F: 0, L: 1, B: 2, R: 3 },
  };

  const indexToSide = {
    F: { 0: "L", 1: "D", 2: "R", 3: "U" },
    B: { 0: "L", 1: "U", 2: "R", 3: "D" },
    L: { 0: "F", 1: "U", 2: "B", 3: "D" },
    R: { 0: "F", 1: "D", 2: "B", 3: "U" },
    U: { 0: "F", 1: "R", 2: "B", 3: "L" },
    D: { 0: "F", 1: "L", 2: "B", 3: "R" },
  };

  const getNextSide = (active_side, cur_side) => {
    let num_iters = props.numRotations;
    let cur_index = sideToIndex[active_side][cur_side];
    let nxt_index = (cur_index + num_iters) % 4;
    return indexToSide[active_side][nxt_index];
  };

  useEffect(() => {
    if (props.activeSide === "") return;

    if (isCubeOnActiveSide()) {
      if (props.isAnimationDone && !isFirstRender.current) {
        let updatedCubeColors = null;
        switch (props.activeSide) {
          case "F":
            updatedCubeColors = {
              ...cubeColors,
              R: cubeColors[getNextSide("F", "R")],
              L: cubeColors[getNextSide("F", "L")],
              U: cubeColors[getNextSide("F", "U")],
              D: cubeColors[getNextSide("F", "D")],
              F: cubeColors.F,
              B: cubeColors.B,
            };
            break;
          case "B":
            updatedCubeColors = {
              ...cubeColors,
              R: cubeColors[getNextSide("B", "R")],
              L: cubeColors[getNextSide("B", "L")],
              U: cubeColors[getNextSide("B", "U")],
              D: cubeColors[getNextSide("B", "D")],
              F: cubeColors.F,
              B: cubeColors.B,
            };
            break;
          case "L":
            updatedCubeColors = {
              ...cubeColors,
              R: cubeColors.R,
              L: cubeColors.L,
              U: cubeColors[getNextSide("L", "U")],
              D: cubeColors[getNextSide("L", "D")],
              F: cubeColors[getNextSide("L", "F")],
              B: cubeColors[getNextSide("L", "B")],
            };
            break;
          case "R":
            updatedCubeColors = {
              ...cubeColors,
              R: cubeColors.R,
              L: cubeColors.L,
              U: cubeColors[getNextSide("R", "U")],
              D: cubeColors[getNextSide("R", "D")],
              F: cubeColors[getNextSide("R", "F")],
              B: cubeColors[getNextSide("R", "B")],
            };
            break;
          case "U":
            updatedCubeColors = {
              ...cubeColors,
              R: cubeColors[getNextSide("U", "R")],
              L: cubeColors[getNextSide("U", "L")],
              U: cubeColors.U,
              D: cubeColors.D,
              F: cubeColors[getNextSide("U", "F")],
              B: cubeColors[getNextSide("U", "B")],
            };
            break;
          case "D":
            updatedCubeColors = {
              ...cubeColors,
              R: cubeColors[getNextSide("D", "R")],
              L: cubeColors[getNextSide("D", "L")],
              U: cubeColors.U,
              D: cubeColors.D,
              F: cubeColors[getNextSide("D", "F")],
              B: cubeColors[getNextSide("D", "B")],
            };
            break;
        }
        // update the state of the object
        setCubeColors(updatedCubeColors);
        props.incrementCubesUpdated();
      }
      isFirstRender.current = false;
    }
  }, [props.isAnimationDone]);

  useEffect(() => {
    if (cubeRef.current) {
      cube_position.current = cubeRef.current.position;
    }
  }, [cubeRef.current?.position]);

  return (
    <animated.mesh
      ref={cubeRef}
      position={[
        cubeRef.current ? cubeRef.current.position.x : props.position.x,
        cubeRef.current ? cubeRef.current.position.y : props.position.y,
        cubeRef.current ? cubeRef.current.position.z : props.position.z,
      ]}
    >
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      {/* red | right */}
      <meshBasicMaterial attach="material-0" color={cubeColors.R} />
      {/* orange | left */}
      <meshBasicMaterial attach="material-1" color={cubeColors.L} />
      {/* white | top */}
      <meshBasicMaterial attach="material-2" color={cubeColors.U} />
      {/* yellow | bottom */}
      <meshBasicMaterial attach="material-3" color={cubeColors.D} />
      {/* green | front */}
      <meshBasicMaterial attach="material-4" color={cubeColors.F} />
      {/* blue | back */}
      <meshBasicMaterial attach="material-5" color={cubeColors.B} />
    </animated.mesh>
  );
};

export default Cube;
