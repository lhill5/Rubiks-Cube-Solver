import React from "react";
import RubiksCube from "../components/RubiksCube";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import RotationControls from "../components/RotationControls";
import styles from "../styles/ScramblePage.module.css";

export default function ScramblePage(props) {
  return (
    <div className={styles["center"]}>
      <RotationControls
        updateRotation={props.updateRotation}
      ></RotationControls>
      <div className={styles["btn-header"]}>
        <button onClick={props.scramble}>Scramble</button>
      </div>
    </div>
  );
}
