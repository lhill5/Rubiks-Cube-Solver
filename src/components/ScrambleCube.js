import React from "react";
import classnames from "classnames";
import { ReactComponent as ScrambleSVG } from "../images/scramble.svg";
import styles from "../styles/ScrambleCube.module.css";

export default function ScrambleCube(props) {
  return (
    <div className={styles["svg-header"]}>
      <ScrambleSVG
        onClick={props.scramble}
        className={classnames(styles["svg"], styles["scramble-svg"])}
      ></ScrambleSVG>
    </div>
  );
}
