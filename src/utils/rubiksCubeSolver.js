import axios from "axios";

export const solveRubiksCube = async (cubeState) => {
  const cubeStateJSON = JSON.stringify(cubeState);
  console.log("here");
  // Make an axios POST request with the JSON string as a parameter
  return axios
    .post("http://localhost:8000/rubiks-solution/", { data: cubeStateJSON })
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
