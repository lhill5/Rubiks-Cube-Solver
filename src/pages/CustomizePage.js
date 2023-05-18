import React from "react";
import ColorPicker from "../components/ColorPicker";
import RubiksCube from "../components/RubiksCube";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import styles from "../styles/CustomizePage.module.css";

export default function CustomizePage(props) {
  return (
    <div className={styles["center"]}>
      <ColorPicker
        activeColor={props.activeColor}
        setActiveColor={props.setActiveColor}
      ></ColorPicker>
    </div>
  );
}
