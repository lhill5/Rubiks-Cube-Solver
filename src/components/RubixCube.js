import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGesture } from "react-use-gesture";
import { useSpring, animated } from "@react-spring/three";

function RubixCube(props) {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [x_offset, y_offset] = [0.45, 0.75];

  /* cube refs */
  const cubeRef = useRef();
  const centerRef = useRef();
  const frontTurn = useRef();
  const backTurn = useRef();
  const leftTurn = useRef();
  const rightTurn = useRef();
  const upTurn = useRef();
  const downTurn = useRef();
  const unused = useRef();

  const isMounted = useRef(false);
  const [xPos, yPos] = [useRef(x_offset), useRef(y_offset)];

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [x_offset, y_offset, 0],
    config: { friction: 20 },
  }));

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      set({
        rotation: [y / aspect + xPos.current, x / aspect + yPos.current, 0],
      });
    },
    onHover: ({ hovering }) =>
      set({ scale: hovering ? [1.05, 1.05, 1.05] : [1, 1, 1] }),
  });

  useEffect(() => {
    if (isMounted.current) {
      set({
        rotation: [
          cubeRef.current.rotation.x,
          cubeRef.current.rotation.y + Math.PI / 2,
          0,
        ],
      });
      yPos.current += Math.PI / 2;
    } else {
      isMounted.current = true;
    }
  }, [props.rotateLeft]);

  return (
    <>
      <animated.group ref={cubeRef} {...spring} {...bind()} {...props}>
        <group ref={centerRef}>
          <Cube position={[0, 0, -1]} /> {/* L0 */}
          <Cube position={[-1, 0, 0]} /> {/* F0 */}
          <Cube position={[0, 0, 0]} /> {/* C0 */}
          <Cube position={[1, 0, 0]} /> {/* B0 */}
          <Cube position={[0, -1, 0]} /> {/* D0 */}
          <Cube position={[0, 1, 0]} /> {/* U0 */}
          <Cube position={[0, 0, 1]} /> {/* R0 */}
        </group>
        <group ref={frontTurn}>
          <Cube position={[-1, 1, -1]} /> {/* F1, U7, L3 */}
          <Cube position={[-1, 1, 0]} /> {/* F2, U6 */}
          <Cube position={[-1, 1, 1]} /> {/* F3, U5, R1 */}
          <Cube position={[-1, 0, 1]} /> {/* F4, R8 */}
          <Cube position={[-1, -1, 1]} /> {/* F5, R7, D3 */}
          <Cube position={[-1, -1, 0]} /> {/* F6, D2 */}
          <Cube position={[-1, -1, -1]} /> {/* F7, L5, D1 */}
          <Cube position={[-1, 0, -1]} /> {/* F8, L4 */}
        </group>
        <group ref={backTurn}>
          <Cube position={[1, 1, 1]} /> {/* B1, R3, U3 */}
          <Cube position={[1, 1, 0]} /> {/* B2, U2 */}
          <Cube position={[1, 1, -1]} /> {/* B3, L1, U1 */}
          <Cube position={[1, 0, -1]} /> {/* B4, L8 */}
          <Cube position={[1, -1, -1]} /> {/* B5, L7, D7 */}
          <Cube position={[1, -1, 0]} /> {/* B6, D6 */}
          <Cube position={[1, -1, 1]} /> {/* B7, R5, D5 */}
          <Cube position={[1, 0, 1]} /> {/* B8, R4 */}
        </group>
        <group ref={leftTurn}></group>
        <group ref={rightTurn}></group>
        <group ref={upTurn}></group>
        <group ref={downTurn}></group>
        <group ref={unused}>
          <Cube position={[0, -1, -1]} /> {/* L6, D8 */}
          <Cube position={[0, 1, -1]} /> {/* L2, U8 */}
          <Cube position={[0, -1, 1]} /> {/* R6, D4 */}
          <Cube position={[0, 1, 1]} /> {/* R2, U4 */}
        </group>
      </animated.group>
    </>
  );
}

const Cube = (props) => {
  return (
    <animated.mesh
      {...props}
      animate={{ rotateY: 2 * Math.PI }}
      transition={{ duration: 2 }}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshBasicMaterial attach="material-0" color="#009b48" />
      <meshBasicMaterial attach="material-2" color="#ffffff" />
      <meshBasicMaterial attach="material-1" color="#b71234" />
      <meshBasicMaterial attach="material-3" color="#ffd500" />
      <meshBasicMaterial attach="material-4" color="#0046ad" />
      <meshBasicMaterial attach="material-5" color="#ff5800" />
    </animated.mesh>
  );
};

export default RubixCube;
