import React, { useState } from "react";
import RubiksCube from "../components/RubiksCube";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import classnames from "classnames";

import styles from "../styles/SolvePage.module.css";
import { ReactComponent as PlayButtonIcon } from "../images/play-button.svg";
import { ReactComponent as PauseButtonIcon } from "../images/pause-button.svg";
import { ReactComponent as FastForwardIcon } from "../images/fast-forward.svg";

export default function SolvePage(props) {
  const [paused, setPaused] = useState(true);

  return (
    <div className={styles["solve-buttons"]}>
      <div className={styles["button-cls"]}>
        <button
          onClick={() => {
            props.solve();
          }}
        >
          Solve
        </button>
      </div>
      <div className={classnames(styles["row"], styles["icon-header"])}>
        <FastForwardIcon
          className={classnames(styles["flip"], styles["control-icon"])}
        ></FastForwardIcon>

        {paused ? (
          <PlayButtonIcon
            className={styles["control-icon"]}
            onClick={() => setPaused(!paused)}
          >
            H
          </PlayButtonIcon>
        ) : (
          <PauseButtonIcon
            className={styles["control-icon"]}
            onClick={() => setPaused(!paused)}
          />
        )}

        <FastForwardIcon className={styles["control-icon"]} />
      </div>
    </div>
  );
}
