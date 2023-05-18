import React, { useState, useRef } from "react";

import classNames from "classnames";
import styles from "../styles/ColorPicker.module.css";

export default function ColorPicker({ activeColor, setActiveColor }) {
  let color = "white";

  return (
    <div className={styles["color-picker"]}>
      <ColorBox
        color="white"
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      ></ColorBox>
      <ColorBox
        color="orange"
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      ></ColorBox>
      <ColorBox
        color="green"
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      ></ColorBox>
      <ColorBox
        color="red"
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      ></ColorBox>
      <ColorBox
        color="blue"
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      ></ColorBox>
      <ColorBox
        color="yellow"
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      ></ColorBox>
    </div>
  );
}

const ColorBox = (props) => {
  return (
    <button
      className={classNames(
        styles[`${props.color}-btn`],
        props.color === props.activeColor ? styles["selected"] : ""
      )}
      onClick={() =>
        props.activeColor !== props.color
          ? props.setActiveColor(props.color)
          : props.setActiveColor("")
      }
    ></button>
  );
};
