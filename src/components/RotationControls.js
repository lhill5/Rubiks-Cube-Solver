import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import styles from "../styles/RotationControls.module.css";
import { combineMoves, isEmptyObject } from "../utils/helper";

export default function RotationControls({ updateRotation }) {
  const [prevMove, setPrevMove] = useState({});
  const [combinedMove, setCombinedMove] = useState({});

  const handleClick = (move) => {
    // if user clicks rotate button again, reset timer and wait for user
    // to finish clicking (adds up all clicks and rotates that many times)
    let combined_move = combineMoves(move, prevMove);
    setCombinedMove(combined_move);
    setPrevMove(move);
  };

  useEffect(() => {
    if (isEmptyObject(combinedMove)) return;

    const handleDebouncedClick = debounce(() => {
      updateRotation(combinedMove);
      setPrevMove({});
    }, 200);

    handleDebouncedClick();

    return () => {
      handleDebouncedClick.cancel();
    };
  }, [combinedMove]);

  return (
    <div className={styles["rotate-btns"]}>
      <div className={styles["btn-group"]}>
        <button
          className={styles["front"]}
          onClick={() => handleClick({ side: "F", rotations: 1, prime: false })}
        >
          F
        </button>
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["back"]}
          onClick={() => handleClick({ side: "B", rotations: 1, prime: false })}
        >
          B
        </button>
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["left"]}
          onClick={() => handleClick({ side: "L", rotations: 1, prime: false })}
        >
          L
        </button>
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["right"]}
          onClick={() => handleClick({ side: "R", rotations: 1, prime: false })}
        >
          R
        </button>
      </div>
      <div className={styles["btn-group"]}>
        <button
          className={styles["up"]}
          onClick={() => handleClick({ side: "U", rotations: 1, prime: false })}
        >
          U
        </button>
      </div>

      <div className={styles["btn-group"]}>
        <button
          className={styles["down"]}
          onClick={() => handleClick({ side: "D", rotations: 1, prime: false })}
        >
          D
        </button>
      </div>
    </div>
  );
}
