import React from "react";
import ColorPicker from "../components/ColorPicker";

export default function CustomizePage({ activeColor, setActiveColor }) {
  return (
    <ColorPicker activeColor={activeColor} setActiveColor={setActiveColor} />
  );
}
