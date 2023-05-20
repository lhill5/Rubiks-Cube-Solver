import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ScramblePage from "./pages/ScramblePage";
import CustomizePage from "./pages/CustomizePage";
import SolvePage from "./pages/SolvePage";

import RubiksCube from "./components/RubiksCube";
import ClearCube from "./components/ClearCube";
import ScrambleCube from "./components/ScrambleCube";

import Header from "./components/Header";
import styles from "./styles/App.module.css";
import { convertCoordToSquareNotations } from "./utils/rubiksCubeConverter";
import { solveRubiksCube } from "./utils/rubiksCubeSolver";

function App() {
  const [page, setPage] = useState("");
  const [activeSide, setActiveSide] = useState("");
  const [movesQueue, setMovesQueue] = useState([]);
  const [isMoveDone, setMoveDone] = useState(false);
  const [rubiksCubeState, setRubiksCubeState] = useState({});
  const [rubiksCubeSolution, setRubiksCubeSolution] = useState("");
  const [clearQueue, setClearQueue] = useState(false);
  const [clearCube, toggleClearCube] = useState(false);
  const [fillCube, toggleFillCube] = useState(false);

  // tracks which ColorPicker box is selected
  const [activeColor, setActiveColor] = useState("");

  const numRotations = useRef(0);
  const isMounted = useRef(false);

  const updateRotation = (side, num_rotations = 1) => {
    setActiveSide(side);
    numRotations.current += num_rotations;
  };

  const resetRotation = useCallback(() => {
    setActiveSide("");
    numRotations.current = 0;
  }, []);

  const enqueueItem = useCallback((side, num_rotations) => {
    return new Promise((resolve) => {
      setMovesQueue((prevQueue) => {
        // Check if the movesQueue is not empty and the last side has the same key as the new side
        let newQueue;
        if (
          prevQueue.length > 0 &&
          prevQueue[prevQueue.length - 1].side === side
        ) {
          // Get the last side in the previous queue and increment its value by 1
          const lastSide = prevQueue[prevQueue.length - 1];
          newQueue = [
            ...prevQueue.slice(0, -1),
            { side: side, rotations: lastSide.rotations + 1 },
          ];
        } else {
          // Otherwise, add the new side with the number of rotatations to the end of the queue
          newQueue = [...prevQueue, { side: side, rotations: num_rotations }];
        }
        resolve(newQueue);
        return newQueue;
      });
    });
  }, []);

  const dequeueItem = useCallback(() => {
    return new Promise((resolve, reject) => {
      setMovesQueue((prevQueue) => {
        if (prevQueue.length === 0) {
          reject("Queue is empty");
          return prevQueue;
        }

        const [removedItem, ...newQueue] = prevQueue;
        resolve(removedItem);
        return newQueue;
      });
    });
  }, []);

  const setCubeState = (position, cube_colors) => {
    let square_notations = convertCoordToSquareNotations(position, cube_colors);
    setRubiksCubeState((prevRubiksCubeState) => {
      return { ...prevRubiksCubeState, ...square_notations };
    });
  };

  const scramble = useCallback(async () => {
    setClearQueue(true);
    const items = ["F", "B", "L", "R", "U", "D"];
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomMove = items[randomIndex];
      enqueueItem(randomMove, 1);
    }
  }, [enqueueItem]);

  const solve = () => {
    let cubeSolverConfig = [
      ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9"],
      ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"],
      ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"],
      ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
      ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9"],
      ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"],
    ];
    let formattedRCSolution = cubeSolverConfig.map((side) =>
      side.map((square) => rubiksCubeState[square])
    );

    solveRubiksCube(formattedRCSolution)
      .then((data) => setRubiksCubeSolution(data.solution))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!isMounted.current) return;

    if (clearQueue || isMoveDone) {
      if (movesQueue.length !== 0) {
        try {
          dequeueItem()
            .then((move) => {
              updateRotation(move.side, move.rotations);
            })
            .catch((error) => console.error(error));
        } catch (error) {}
      }
      setClearQueue(false);
      setMoveDone(false);
    }
  }, [isMoveDone, clearQueue]);

  useEffect(() => {
    isMounted.current = true;
  });

  useEffect(() => {
    if (rubiksCubeSolution) {
      const solution_array = rubiksCubeSolution.split(" ");
      for (let move of solution_array) {
        const [side, num_rotations] = move.split("");
        enqueueItem(side, parseInt(num_rotations));
      }
      setClearQueue(true);
    }
  }, [rubiksCubeSolution]);

  useEffect(() => {
    console.log(movesQueue);
  }, [movesQueue.length]);

  useEffect(() => {
    function handleClick(event) {
      // Check if the clicked element is not a button
      if (
        event.target.tagName !== "BUTTON" &&
        event.target.tagName !== "CANVAS"
      ) {
        // Call your function here
        setActiveColor("");
      }
    }

    // Attach event listener on mount
    document.body.addEventListener("click", handleClick);

    // Detach event listener on unmount
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []); // Make sure to include an empty dependency array to run the effect only once on mount

  return (
    <>
      <Router>
        <Header setPage={setPage} />
        <div className={styles["background"]}>
          <div className={styles["rubiks-cube"]}>
            {page === "Customize" ? (
              <ClearCube
                toggleClearCube={() => toggleClearCube(!clearCube)}
                toggleFillCube={() => toggleFillCube(!fillCube)}
              ></ClearCube>
            ) : null}

            {page === "Scramble" ? (
              <ScrambleCube scramble={scramble}></ScrambleCube>
            ) : null}

            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <RubiksCube
                activeSide={activeSide}
                numRotations={numRotations}
                resetRotation={resetRotation}
                setCubeState={setCubeState}
                setMoveDone={(state) => setMoveDone(state)}
                activeColor={activeColor}
                clearCube={clearCube}
                fillCube={fillCube}
              />
            </Canvas>

            <Routes>
              <Route
                path="/Scramble"
                element={
                  <ScramblePage updateRotation={updateRotation}></ScramblePage>
                }
              />
              <Route
                path="/Customize"
                element={
                  <CustomizePage
                    activeColor={activeColor}
                    setActiveColor={setActiveColor}
                  ></CustomizePage>
                }
              />
              <Route
                path="/Solve"
                element={<SolvePage scramble={scramble} solve={solve} />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
