import React from "react";
import RubiksCube from "../components/RubiksCube";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import styles from "../styles/SolvePage.module.css";

export default function SolvePage(props) {
  return (
    <div className={styles["main-btns"]}>
      <div className={styles["btn-group"]}>
        <button onClick={() => props.solve()}>Solve</button>
      </div>
    </div>
  );
}
