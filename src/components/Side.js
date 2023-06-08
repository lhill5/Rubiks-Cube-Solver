import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import debounce from "lodash.debounce";

const getRotatedPosition = (side, position3d, prime) => {
  // handles front/right/up rotations

  let position = position3d.slice();
  if (["F", "B"].includes(side)) position = position.slice(0, 2);
  else if (["R", "L"].includes(side)) position = position.slice(1, 3);
  else if (["U", "D"].includes(side)) position.splice(1, 1);

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

  let rotated_prime_position = null;
  rotated_prime_position = rotated_position.map((num) => -num);

  if (["F", "R", "D"].includes(side)) {
    if (prime) {
      return rotated_prime_position;
    } else {
      return rotated_position;
    }
  } else {
    if (prime) {
      return rotated_position;
    } else {
      return rotated_prime_position;
    }
  }
};

const convertToObj = (arr) => {
  const [x, y, z] = arr;
  const obj = { x, y, z };
  return obj;
};

const getFrontRotation = (side, position, num_rotations, prime) => {
  for (let i = 0; i < num_rotations; i++) {
    position = getRotatedPosition(side, position, prime);
    position.splice(2, 0, 1);
  }
  return convertToObj(position);
};

const getBackRotation = (side, position, num_rotations, prime) => {
  for (let i = 0; i < num_rotations; i++) {
    position = getRotatedPosition(side, position, prime);
    position.splice(2, 0, -1);
  }
  return convertToObj(position);
};

const getLeftRotation = (side, position, num_rotations, prime) => {
  for (let i = 0; i < num_rotations; i++) {
    position = getRotatedPosition(side, position, prime);
    position.splice(0, 0, -1);
  }
  return convertToObj(position);
};

const getRightRotation = (side, position, num_rotations, prime) => {
  for (let i = 0; i < num_rotations; i++) {
    position = getRotatedPosition(side, position, prime);
    position.splice(0, 0, 1);
  }
  return convertToObj(position);
};

const getUpRotation = (side, position, num_rotations, prime) => {
  for (let i = 0; i < num_rotations; i++) {
    position = getRotatedPosition(side, position, prime);
    position.splice(1, 0, 1);
  }
  return convertToObj(position);
};

const getDownRotation = (side, position, num_rotations, prime) => {
  for (let i = 0; i < num_rotations; i++) {
    position = getRotatedPosition(side, position, prime);
    position.splice(1, 0, -1);
  }
  return convertToObj(position);
};

const Side = (props) => {
  const axes = { F: "z", B: "z", L: "x", R: "x", U: "y", D: "y" };
  const axes_lvl = { F: 1, B: -1, L: -1, R: 1, U: 1, D: -1 };
  const axis = axes[props.side];
  const axis_lvl = axes_lvl[props.side];

  const [sideSpring, setSide] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { friction: 20 },
    onRest: {
      rotation: () => {
        props.setAnimationDone(true);
      },
    },
  }));

  const rotateSide = (num_rotations, prime) => {
    const side = props.side;
    const cw = ["F", "R", "U"].includes(side) ? 1 : -1;
    const prime_dir = prime ? -1 : 1;

    const rotation_angle = cw * prime_dir * num_rotations * (-Math.PI / 2);

    const x = ["L", "R"].includes(side)
      ? props.group.current.rotation.x + rotation_angle
      : props.group.current.rotation.x;

    const y = ["U", "D"].includes(side)
      ? props.group.current.rotation.y + rotation_angle
      : props.group.current.rotation.y;

    const z = ["F", "B"].includes(side)
      ? props.group.current.rotation.z + rotation_angle
      : props.group.current.rotation.z;

    setSide({
      rotation: [x, y, z],
      config: {
        duration: 175 * num_rotations,
      },
    });
  };

  const resetRotation = () => {
    props.resetRotation();
    setSide({
      rotation: [0, 0, 0],
      config: {
        duration: 0,
      },
    });
  };

  const isCubeOnSide = (cube) => {
    if (props.side === "F") {
      if (cube.position.z === 1) return true;
    } else if (props.side === "B") {
      if (cube.position.z === -1) return true;
    } else if (props.side === "R") {
      if (cube.position.x === 1) return true;
    } else if (props.side === "L") {
      if (cube.position.x === -1) return true;
    } else if (props.side === "U") {
      if (cube.position.y === 1) return true;
    } else if (props.side === "D") {
      if (cube.position.y === -1) return true;
    }
    return false;
  };

  useEffect(() => {
    if (props.side !== props.currentMove.side) return;

    const handleDebouncedClick = debounce(() => {
      // make sure there's rotations in queue for side
      // and that we're not already animating
      if (props.currentMove.rotations !== 0 && props.isAnimationDone) {
        // prevents multiple animations from happening at the same time
        props.setAnimationDone(false);

        let num_rotations = props.currentMove.rotations;
        let prime = props.currentMove.prime;
        rotateSide(num_rotations, prime);
      }
    }, 250);

    if (props.currentMove.rotations > 0) {
      handleDebouncedClick();
    }
    // if user clicks rotate button again, reset timer and wait for user
    // to finish clicking (adds up all clicks and rotates that many times)
    return () => {
      handleDebouncedClick.cancel();
    };
  }, [props.sideUpdate]);

  useEffect(() => {
    if (props.side !== props.currentMove.side) return;

    let cubes = props.cubesRef.current.children.slice();
    cubes.filter((cube) => cube.position[axis] === axis_lvl);

    for (let cube of cubes) {
      if (props.side === props.currentMove.side && isCubeOnSide(cube)) {
        props.group.current.add(cube);
      }
    }
  }, [props.sideUpdate]);

  useEffect(() => {
    if (props.side !== props.currentMove.side) return;

    let cubes = props.group.current.children;

    if (props.isAnimationDone) {
      cubes.forEach((cube, i) => {
        let new_position = null;
        switch (props.side) {
          case "F":
            new_position = getFrontRotation(
              props.side,
              Object.values(cube.position),
              props.currentMove.rotations,
              props.currentMove.prime
            );
            break;
          case "B":
            new_position = getBackRotation(
              props.side,
              Object.values(cube.position),
              props.currentMove.rotations,
              props.currentMove.prime
            );
            break;
          case "U":
            new_position = getUpRotation(
              props.side,
              Object.values(cube.position),
              props.currentMove.rotations,
              props.currentMove.prime
            );
            break;
          case "D":
            new_position = getDownRotation(
              props.side,
              Object.values(cube.position),
              props.currentMove.rotations,
              props.currentMove.prime
            );
            break;
          case "L":
            new_position = getLeftRotation(
              props.side,
              Object.values(cube.position),
              props.currentMove.rotations,
              props.currentMove.prime
            );
            break;
          default:
            new_position = getRightRotation(
              props.side,
              Object.values(cube.position),
              props.currentMove.rotations,
              props.currentMove.prime
            );
        }

        cube.position.set(new_position.x, new_position.y, new_position.z);
      });
      resetRotation();
    }
  }, [props.isAnimationDone]);

  return <animated.group {...sideSpring} ref={props.group}></animated.group>;
};

export default Side;
