import React from "react";
import ColorPicker from "../components/ColorPicker";
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
