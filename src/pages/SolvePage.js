import React from "react";
import styles from "../styles/SolvePage.module.css";

export default function SolvePage({ scramble, solve }) {
  return (
    <div className={styles["main-btns"]}>
      <div className={styles["btn-group"]}>
        <button onClick={() => scramble()}>Scramble</button>
      </div>
      <div className={styles["btn-group"]}>
        <button onClick={() => solve()}>Solve</button>
      </div>
    </div>
  );
}
