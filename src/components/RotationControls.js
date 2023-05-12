import React from "react";
import styles from "../styles/RotationControls.module.css";

export default function RotationControls({ updateRotation }) {
  return (
    <div className={styles["rotate-btns"]}>
      <div className={styles["btn-group"]}>
        <button className={styles["front"]} onClick={() => updateRotation("F")}>
          F
        </button>
        {/* <button onClick={() => updateRotation("F'")}>F'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button className={styles["back"]} onClick={() => updateRotation("B")}>
          B
        </button>
        {/* <button onClick={() => updateRotation("B'")}>B'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button className={styles["left"]} onClick={() => updateRotation("L")}>
          L
        </button>
        {/* <button onClick={() => updateRotation("L'")}>L'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button className={styles["right"]} onClick={() => updateRotation("R")}>
          R
        </button>
        {/* <button onClick={() => updateRotation("R'")}>R'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button className={styles["up"]} onClick={() => updateRotation("U")}>
          U
        </button>
        {/* <button onClick={() => updateRotation("U'")}>U'</button> */}
      </div>

      <div className={styles["btn-group"]}>
        <button className={styles["down"]} onClick={() => updateRotation("D")}>
          D
        </button>
        {/* <button onClick={() => updateRotation("D'")}>D'</button> */}
      </div>
    </div>
  );
}
