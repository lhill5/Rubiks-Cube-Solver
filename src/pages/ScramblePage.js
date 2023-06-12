import React from "react";
import RotationControls from "../components/RotationControls";
import styles from "../styles/ScramblePage.module.css";

export default function ScramblePage(props) {
  return (
    <div className={styles["center"]}>
      <RotationControls
        addToQueueHandler={props.addToQueueHandler}
      ></RotationControls>
      <div className={styles["btn-header"]}>
        <button onClick={props.scramble}>Scramble</button>
      </div>
    </div>
  );
}
