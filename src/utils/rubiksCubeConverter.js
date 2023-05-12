export const convertCoordToSquareNotations = (position, colors) => {
  let { x, y, z } = position;

  const cube_colors = Object.fromEntries(
    Object.entries(colors).filter(([key, value]) => value !== "#212121")
  );

  const cube_notations = CoordToSquares(position, cube_colors);
  const cube_notations_obj = cube_notations.reduce((result, notation) => {
    result[notation] = hexToSideColor(colors[notation[0]]);
    return result;
  }, {});

  //   if (x === 1 && y === 1 && z === 1) {
  //     console.log(cube_notations);
  //   }

  return cube_notations_obj;
};

const CoordToSquares = (position, colors) => {
  let sides = [];
  let indices = [];
  let square_notations = [];

  sides = getCubeSides(position);
  for (const side of sides) {
    let index = getSideIndex(side, position);
    square_notations.push(side + index);
  }

  return square_notations;
};

const getCubeSides = (position) => {
  let { x, y, z } = position;
  let sides = [];

  if (x === -1) sides.push("L");
  if (x === 1) sides.push("R");
  if (y === -1) sides.push("D");
  if (y === 1) sides.push("U");
  if (z === -1) sides.push("B");
  if (z === 1) sides.push("F");

  return sides;
};

const getSideIndex = (side, position) => {
  let { x, y, z } = position;

  const convertToSquareIndex = (coord1, coord2) => {
    return coord1 + 2 + (2 - (coord2 + 1)) * 3;
  };

  if (side === "F") return convertToSquareIndex(x, y);
  else if (side === "B") return convertToSquareIndex(-x, y);
  else if (side === "L") return convertToSquareIndex(z, y);
  else if (side === "R") return convertToSquareIndex(-z, y);
  else if (side === "U") return convertToSquareIndex(x, -z);
  else if (side === "D") return convertToSquareIndex(x, z);
};

const hexToSideColor = (hex) => {
  if (hex === "#b71234") return "R";
  else if (hex === "#ff5800") return "L";
  else if (hex === "#ffffff") return "U";
  else if (hex === "#ffd500") return "D";
  else if (hex === "#009b48") return "F";
  else if (hex === "#0046ad") return "B";
};
