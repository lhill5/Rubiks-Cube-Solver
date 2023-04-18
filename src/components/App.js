import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import RubiksCube from "./RubiksCube";
import styles from "../styles/App.module.css";

function App() {
  const [activeSide, setActiveSide] = useState("");
  const numRotations = useRef(0);

  const updateRotation = (side) => {
    setActiveSide(side);
    numRotations.current += 1;
  };

  const resetRotation = () => {
    setActiveSide("");
    numRotations.current = 0;
  };

  return (
    <div>
      <div className={styles["background"]}>
        <div className={styles["rubiks-cube"]}>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <RubiksCube
              activeSide={activeSide}
              numRotations={numRotations}
              resetRotation={resetRotation}
            />
          </Canvas>
        </div>

        <div className={styles["rotate-btns"]}>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("F")}>F</button>
            <button onClick={() => updateRotation("F'")}>F'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("B")}>B</button>
            <button onClick={() => updateRotation("B'")}>B'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("L")}>L</button>
            <button onClick={() => updateRotation("L'")}>L'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("R")}>R</button>
            <button onClick={() => updateRotation("R'")}>R'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("U")}>U</button>
            <button onClick={() => updateRotation("U'")}>U'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("D")}>D</button>
            <button onClick={() => updateRotation("D'")}>D'</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
