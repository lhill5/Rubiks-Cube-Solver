import React from "react";
import { useRef, useEffect } from "react";
import classnames from "classnames";
import styles from "../styles/SolutionHeader.module.css";
import { ReactComponent as ArrowIcon } from "../images/arrow.svg";

const getColorClass = (move, index, current_index, solution) => {
  return classnames({
    [styles.F_move]: move === "F",
    [styles.B_move]: move === "B",
    [styles.L_move]: move === "L",
    [styles.R_move]: move === "R",
    [styles.U_move]: move === "U",
    [styles.D_move]: move === "D",
    [styles.highlight_move]: index === current_index && solution.length !== 0,
  });
};

export default function SolutionHeader(props) {
  const scrollRef = useRef(0);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    console.log(props.scrollState.counter);
    console.log(props.scrollState.direction);

    if (props.scrollState) {
      if (
        props.scrollState.counter !== 0 &&
        props.scrollState.counter % 6 === 0
      ) {
        if (props.scrollState.direction === "backward") {
          handleScrollLeft();
        } else if (props.scrollState.direction === "forward") {
          handleScrollRight();
        }
      }
    }
  }, [props.scrollState]);

  return (
    <div className={styles["scroll-header"]}>
      {props.rubiksCubeSolution.length !== 0 ? (
        <ArrowIcon className={styles["scroll-icon"]} onClick={handleScrollLeft}>
          Left
        </ArrowIcon>
      ) : null}

      <div
        ref={scrollRef}
        className={classnames(styles["svg-header"], styles["snaps-inline"])}
      >
        {props.rubiksCubeSolution.map((move, index) => {
          const color_class = getColorClass(
            move[0],
            index,
            props.solutionCounter - 1,
            props.rubiksCubeSolution
          );

          return (
            <span key={index} className={color_class}>
              {move}
            </span>
          );
        })}
      </div>

      {props.rubiksCubeSolution.length !== 0 ? (
        <ArrowIcon
          className={classnames(styles["scroll-icon"], styles["right-scroll"])}
          onClick={handleScrollRight}
        >
          Right
        </ArrowIcon>
      ) : null}
    </div>
  );
}
