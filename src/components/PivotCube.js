import React from "react";
import classnames from "classnames";
import { ReactComponent as PivotSVG } from "../images/pivot.svg";
import styles from "../styles/PivotCube.module.css";

export default function ScrambleCube(props) {
  return (
    <div className={styles["svg-header"]}>
      {/* <PivotSVG
        onClick={props.togglePivotLeft}
        className={classnames(styles["svg"], styles["pivot-left-svg"])}
      ></PivotSVG>
      <PivotSVG
        onClick={props.togglePivotRight}
        className={classnames(styles["svg"], styles["pivot-right-svg"])}
      ></PivotSVG>
      <PivotSVG
        onClick={props.togglePivotUp}
        className={classnames(styles["svg"], styles["pivot-up-svg"])}
      ></PivotSVG>
      <PivotSVG
        onClick={props.togglePivotDown}
        className={classnames(styles["svg"], styles["pivot-down-svg"])}
      ></PivotSVG> */}
    </div>
  );
}
