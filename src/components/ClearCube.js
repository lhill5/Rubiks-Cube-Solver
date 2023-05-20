import React from "react";
import classnames from "classnames";
import { ReactComponent as ResetSVG } from "../images/reset.svg";
import { ReactComponent as CubeSVG } from "../images/cube.svg";
import styles from "../styles/ClearCube.module.css";

export default function ClearCube(props) {
  return (
    <div className={styles["svg-header"]}>
      {/* <span>hello</span> */}
      <ResetSVG
        className={classnames(styles["svg"], styles["reset-svg"])}
        onClick={() => props.toggleClearCube()}
      ></ResetSVG>
      <CubeSVG
        className={classnames(styles["svg"], styles["cube-svg"])}
        onClick={() => props.toggleFillCube()}
      ></CubeSVG>
    </div>
  );
}
