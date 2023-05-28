import React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useSpring, animated } from "@react-spring/web";
import classnames from "classnames";
import styles from "../styles/SolutionHeader.module.css";
import { ReactComponent as ArrowIcon } from "../images/arrow.svg";

const getColorClass = (move) => {
  return classnames({
    [styles.F_move]: move === "F",
    [styles.B_move]: move === "B",
    [styles.L_move]: move === "L",
    [styles.R_move]: move === "R",
    [styles.U_move]: move === "U",
    [styles.D_move]: move === "D",
  });
};

export default function SolutionHeader(props) {
  const scrollRef = useRef(0);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -225, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 225, behavior: "smooth" });
  };

  return (
    <div className={styles["scroll-header"]}>
      <ArrowIcon className={styles["scroll-icon"]} onClick={handleScrollLeft}>
        Left
      </ArrowIcon>
      <div
        ref={scrollRef}
        className={classnames(styles["svg-header"], styles["snaps-inline"])}
      >
        {props.rubiksCubeSolution.split(" ").map((move, index) => {
          const color_class = getColorClass(move[0]);
          return (
            <span key={index} className={color_class}>
              {move}
            </span>
          );
        })}
      </div>
      <ArrowIcon
        className={classnames(styles["scroll-icon"], styles["right-scroll"])}
        onClick={handleScrollRight}
      >
        Right
      </ArrowIcon>
    </div>
  );
}
