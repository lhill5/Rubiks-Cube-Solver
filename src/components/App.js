import React, { useState, useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import RubixCube from "./RubixCube";
import MeshComponent from "./MeshComponent";
import "../styles/App.css";

function App() {
  const sideRef = useRef();
  const [rotateLeft, setRotateLeft] = useState(false);

  return (
    <div className="App">
      <div className="background">
        <Canvas>
          <PerspectiveCamera makeDefault fov={75} position={[0, 0, 8.5]} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <RubixCube rotateLeft={rotateLeft} setRotateLeft={setRotateLeft} />
        </Canvas>

        <button
          className={"left-btn"}
          onClick={() => setRotateLeft(!rotateLeft)}
        >
          Hello
        </button>
      </div>
    </div>
  );
}

export default App;
