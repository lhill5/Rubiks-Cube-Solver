import axios from "axios";

export const solveRubiksCube = async (cubeState) => {
  const cubeStateJSON = JSON.stringify(cubeState);

  // Make an axios POST request with the JSON string as a parameter
  return axios
    .post(
      "https://2wzb93z1ya.execute-api.us-east-1.amazonaws.com/prod/rubiks-solution/",
      cubeStateJSON
    )
    .then((response) => {
      let response_str = response.data.solution;
      if (response_str.indexOf("Error") !== -1) {
        if (response_str.indexOf("contain exactly 9 facelets") !== -1) {
          return Promise.reject(
            new Error(
              "Rubik's cube provided is invalid. Ensure that each color is used exactly 9 times."
            )
          );
        }
      }

      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const isSolved = (cubeState) => {
  for (let square in cubeState) {
    if (cubeState[square] !== square[0]) return false;
  }
  return true;
};

export const isInvalidState = (cubeState) => {
  let color_counter = { U: 0, D: 0, L: 0, R: 0, F: 0, B: 0 };
  let color_lookup = {
    U: "white",
    D: "yellow",
    L: "orange",
    R: "red",
    F: "green",
    B: "blue",
  };

  for (let square in cubeState) {
    let square_color = cubeState[square];
    if (square_color === undefined) {
      return "One or more squares were left blank. To resolve this, please make sure all squares are filled in.";
    }

    color_counter[square_color] += 1;
  }

  // if cube doesn't have 9 of each color then it's an invalid rubiks cube
  for (let color in color_counter) {
    if (color_counter[color] !== 9) {
      return `Currently, there are ${color_counter[color]} ${color_lookup[color]} squares on the Rubik's Cube. To resolve this, please ensure that exactly 9 ${color_lookup[color]} squares are filled in.`;
    }
  }
  return "valid";
};
