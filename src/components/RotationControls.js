import React from "react";
import styles from "../styles/RotationControls.module.css";

export default function RotationControls({ updateRotation }) {
  return (
    <div className={styles["rotate-btns"]}>
      <div className={styles["btn-group"]}>
        <button
          className={styles["front"]}
          onClick={() =>
            updateRotation({ side: "F", rotations: 1, prime: false })
          }
        >
          F
        </button>
        {/* <button onClick={() => updateRotation("F'")}>F'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["back"]}
          onClick={() =>
            updateRotation({ side: "B", rotations: 1, prime: false })
          }
        >
          B
        </button>
        {/* <button onClick={() => updateRotation("B'")}>B'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["left"]}
          onClick={() =>
            updateRotation({ side: "L", rotations: 1, prime: false })
          }
        >
          L
        </button>
        {/* <button onClick={() => updateRotation("L'")}>L'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["right"]}
          onClick={() =>
            updateRotation({ side: "R", rotations: 1, prime: false })
          }
        >
          R
        </button>
        {/* <button onClick={() => updateRotation("R'")}>R'</button> */}
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["up"]}
          onClick={() =>
            updateRotation({ side: "U", rotations: 1, prime: false })
          }
        >
          U
        </button>
        {/* <button onClick={() => updateRotation("U'")}>U'</button> */}
      </div>

      <div className={styles["btn-group"]}>
        <button
          className={styles["down"]}
          onClick={() =>
            updateRotation({ side: "D", rotations: 1, prime: false })
          }
        >
          D
        </button>
        {/* <button onClick={() => updateRotation("D'")}>D'</button> */}
      </div>
    </div>
  );
}
