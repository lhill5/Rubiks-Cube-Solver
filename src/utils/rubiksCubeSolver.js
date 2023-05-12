import axios from "axios";

export const solveRubiksCube = async (cubeState) => {
  const cubeStateJSON = JSON.stringify(cubeState);

  // Make an axios POST request with the JSON string as a parameter
  return axios
    .post("http://localhost:8000/rubiks-solution/", { data: cubeStateJSON })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};
