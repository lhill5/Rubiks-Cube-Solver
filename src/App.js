import React, { useState, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import ScramblePage from "./pages/ScramblePage";
import CustomizePage from "./pages/CustomizePage";
import SolvePage from "./pages/SolvePage";

import RubiksCube from "./components/RubiksCube";
import ClearCube from "./components/ClearCube";
import PivotCube from "./components/PivotCube";
import SolutionHeader from "./components/SolutionHeader";

import Header from "./components/Header";
import styles from "./styles/App.module.css";

import { convertStrMoveToObj, equalObjs } from "./utils/helper";
import {
  convertCoordToSquareNotations,
  hasBlankSquare,
} from "./utils/rubiksCubeConverter";
import { solveRubiksCube } from "./utils/rubiksCubeSolver";
import { isPlainObject } from "lodash";

function App() {
  const [page, setPage] = useState("Scramble");
  const [rubiksCubeState, setRubiksCubeState] = useState({});
  const [rubiksCubeSolution, setRubiksCubeSolution] = useState([]);

  // used to keep track of which move of the solution we're on
  const [currentMove, setCurrentMove] = useState({});
  const [solutionCounter, setSolutionCounter] = useState(0);
  // keeps track of which step we're at in solution on horizontal scrollbar
  const [scrollState, setScrollState] = useState({ counter: 0, direction: "" });

  // defines queue & states to trigger queue removal
  const [movesQueue, setMovesQueue] = useState([]);
  const [popQueue, setPopQueue] = useState(false);
  const [manualMove, setManualMove] = useState(false);

  // defines if move is done (animation done + cube colors/position updated)
  const [isMoveDone, updateMoveDone] = useState(false);
  // represents number of moves that have yet to be "completed" (i.e. done animating and updating cubes)
  const [isFirstMove, setFirstMove] = useState(true);
  const [isFirstSolveMove, setFirstSolveMove] = useState(true);

  // handles solve page when multiple clicks are made simultaneously
  const [solveQueue, setSolveQueue] = useState([]);
  // differentiates scramble moves from solve moves in movesQueue
  const [solveType, setSolveType] = useState("");

  // sets cube colors blank to simplify user input
  const [clearCube, toggleClearCube] = useState(false);
  // sets cube colors in solve state to reset user input
  const [fillCube, toggleFillCube] = useState(false);

  // used to rotate entire cube left/right/up/down
  const [pivotLeft, togglePivotLeft] = useState(false);
  const [pivotRight, togglePivotRight] = useState(false);
  const [pivotUp, togglePivotUp] = useState(false);
  const [pivotDown, togglePivotDown] = useState(false);

  // tracks which ColorPicker box is selected
  const [activeColor, setActiveColor] = useState("");
  // used on Solve page, if not in pauseMode then solution is shown step-by-step
  const [pauseMode, setPauseMode] = useState(false);

  const updateRotation = (move) => {
    updateMoveDone(false);

    if (move.rotations !== 0) {
      updateMoveDone(false);
      setCurrentMove(move);
    }
  };

  const resetRotation = useCallback(() => {
    setCurrentMove({ side: "", rotations: 0, prime: "" });
  }, []);

  const enqueueItem = useCallback((move) => {
    return new Promise((resolve) => {
      setMovesQueue((prevQueue) => {
        // Check if the movesQueue is not empty and the last side has the same key as the new side
        let newQueue;
        if (
          prevQueue.length > 0 &&
          prevQueue[prevQueue.length - 1].side === move.side
        ) {
          // if current move is same as previous move, replace last queue item with # of rotations
          const lastMove = prevQueue[prevQueue.length - 1];
          const new_num_rotations = lastMove.rotations + move.rotations;
          const prime = new_num_rotations < 0;

          if (new_num_rotations === 0) {
            newQueue = [...prevQueue.slice(0, -1)];
          } else {
            newQueue = [
              ...prevQueue.slice(0, -1),
              {
                side: move.side,
                rotations: lastMove.rotations + move.rotations,
                prime: prime,
              },
            ];
          }
        } else {
          // Otherwise, add the new side with the number of rotatations to the end of the queue
          const prime = move.rotations < 0;
          newQueue = [
            ...prevQueue,
            { side: move.side, rotations: move.rotations, prime: prime },
          ];
        }

        resolve(newQueue);
        return newQueue;
      });
    });
  }, []);

  const enqueueSolveItem = useCallback((move) => {
    // adds item to solve queue (basic add to list method,
    // doesn't check for duplicate moves that enqueueItems does

    return new Promise((resolve) => {
      setSolveQueue((prevQueue) => {
        let newQueue;
        newQueue = [
          ...prevQueue,
          {
            side: move.side,
            rotations: parseInt(move.rotations),
            prime: move.prime,
          },
        ];

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

  const dequeueSolveItem = useCallback(() => {
    return new Promise((resolve, reject) => {
      setSolveQueue((prevQueue) => {
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
    setSolveType("scramble");
    setPopQueue(true);
    const sides = ["F", "B", "L", "R", "U", "D"];
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * sides.length);
      const randomSide = sides[randomIndex];
      enqueueItem({ side: randomSide, rotations: 1, prime: false });
    }
  }, [enqueueItem]);

  const solve = () => {
    if (hasBlankSquare(rubiksCubeState)) {
      alert(
        "Rubik's cube provided is invalid. At least 1 square is uncolored, make sure all squares are colored."
      );
      return;
    }

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
      .then((data) => {
        let solution = data.solution;
        let solution_array = solution.split(" ").filter((s) => s.trim() != "");
        setRubiksCubeSolution(solution_array);
        setSolutionCounter(0);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const addToQueueHandler = (move) => {
    enqueueItem(move);
    if (isFirstMove) {
      setFirstMove(false);
      setPopQueue(true);
    }
  };

  // used in solution page to skip to the prev solution's move
  const goBackMove = () => {
    if (solutionCounter === 0) return;

    // get previous move & convert to move obj
    let prev_move_str = rubiksCubeSolution[solutionCounter - 1];
    let side = prev_move_str[0];
    let rotations = prev_move_str[prev_move_str.length - 1];
    let prime = prev_move_str.includes("'");
    let prev_move = { side: side, rotations: rotations, prime: prime };

    // do opposite of previous move (prime = !prime)
    prev_move.prime = !prev_move.prime;

    // add move to solve queue (handles multiple button clicks through the use of a queue)
    enqueueSolveItem(prev_move);
    // move back 1 move in solution
    setSolutionCounter(solutionCounter - 1);
    setSolveType("backward");

    // keep track of where we are on horizontal solution pane
    setScrollState({
      counter: scrollState.counter - 1 < 0 ? 0 : scrollState.counter - 1,
      direction: "backward",
    });

    if (isFirstSolveMove) {
      setFirstSolveMove(false);
      setManualMove(true);
    }
  };

  // used in solution page to skip to the next solution's move
  const goForwardMove = () => {
    // cannot go forward if at end of solution
    if (solutionCounter >= rubiksCubeSolution.length) return;

    // get next solution move
    let nxt_solution_move = convertStrMoveToObj(
      rubiksCubeSolution[solutionCounter]
    );

    // add to queue (priority 1)
    enqueueSolveItem(nxt_solution_move);
    // move forward 1 move in solution
    setSolutionCounter(solutionCounter + 1);
    setSolveType("forward");

    // keep track of where we are on horizontal solution pane
    setScrollState({
      counter:
        scrollState.counter + 1 > rubiksCubeSolution.length
          ? 0
          : scrollState.counter + 1,
      direction: "forward",
    });

    if (isFirstSolveMove) {
      setFirstSolveMove(false);
      setManualMove(true);
    }
  };

  // handles new rubik's cube solutions
  useEffect(() => {
    if (!equalObjs(rubiksCubeSolution, [])) {
      for (let move of rubiksCubeSolution) {
        const [side, num_rotations] = move.split("");
        enqueueItem({
          side: side,
          rotations: parseInt(num_rotations),
          prime: false,
        });
      }
      setSolveType("solve");
      setPopQueue(true);
    }
  }, [rubiksCubeSolution]);

  // deselects color picked if you click on the same color again or outside of the canvas (rubik's cube)
  useEffect(() => {
    function handleClick(event) {
      // Check if the clicked element is not a button or on canvas (rubik's cube)
      if (
        event.target.tagName !== "BUTTON" &&
        event.target.tagName !== "CANVAS"
      ) {
        setActiveColor("");
      }
    }

    // Attach event listener on mount
    document.body.addEventListener("click", handleClick);

    // Detach event listener on unmount
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);

  // handles getting next move & starting animation
  useEffect(() => {
    if (pauseMode && !manualMove) {
      setPopQueue(false);
      return;
    }

    // if automatic move (popQueue) or in pause mode
    // and user manually clicked forward/backward then move
    if (popQueue || manualMove) {
      if (popQueue && movesQueue.length !== 0) {
        try {
          dequeueItem()
            .then((move) => {
              updateRotation(move);
              if (!manualMove && solveType === "solve") {
                setSolutionCounter(solutionCounter + 1);
                setScrollState({
                  counter: scrollState.counter + 1,
                  direction: "forward",
                });
              }
            })
            .catch((error) => console.error(error));
        } catch (error) {}
      } else if (manualMove && solveQueue.length !== 0) {
        try {
          dequeueSolveItem()
            .then((move) => {
              updateRotation(move);
            })
            .catch((error) => console.error(error));
        } catch (error) {}
      }

      setPopQueue(false);
      setManualMove(false);
    }
  }, [popQueue, pauseMode, manualMove, solveType]);

  // triggers next move from queue to be played
  useEffect(() => {
    if (isMoveDone) {
      // if we played out solution on solve page, don't make another move, isMoveDone remains true
      if (solutionCounter > rubiksCubeSolution.length) {
        setFirstMove(true);
        return;
      }

      if (movesQueue.length !== 0) {
        setPopQueue(true);
      } else {
        setFirstMove(true);
      }
    }
  }, [isMoveDone]);

  // triggers next move from queue to be played
  useEffect(() => {
    if (isMoveDone) {
      // if we played out solution on solve page, don't make another move, isMoveDone remains true
      if (solutionCounter > rubiksCubeSolution.length) {
        setFirstSolveMove(true);
        return;
      }

      if (solveQueue.length !== 0) {
        setManualMove(true);
      } else {
        setFirstSolveMove(true);
      }
    }
  }, [isMoveDone]);

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
              <PivotCube
                togglePivotLeft={() => togglePivotLeft(!pivotLeft)}
                togglePivotRight={() => togglePivotRight(!pivotRight)}
                togglePivotUp={() => togglePivotUp(!pivotUp)}
                togglePivotDown={() => togglePivotDown(!pivotDown)}
              ></PivotCube>
            ) : null}

            {page === "Solve" ? (
              <SolutionHeader
                rubiksCubeSolution={rubiksCubeSolution}
                solutionCounter={solutionCounter}
                scrollState={scrollState}
                setScrollState={setScrollState}
              ></SolutionHeader>
            ) : null}

            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <RubiksCube
                currentMove={currentMove}
                resetRotation={resetRotation}
                setCubeState={setCubeState}
                updateMoveDone={(state) => updateMoveDone(state)}
                activeColor={activeColor}
                clearCube={clearCube}
                fillCube={fillCube}
                pivotLeft={pivotLeft}
                pivotRight={pivotRight}
                pivotUp={pivotUp}
                pivotDown={pivotDown}
              />
            </Canvas>

            <Routes>
              <Route
                path="/Scramble"
                element={
                  <ScramblePage
                    addToQueueHandler={addToQueueHandler}
                    scramble={scramble}
                  ></ScramblePage>
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
                element={
                  <SolvePage
                    scramble={scramble}
                    solve={solve}
                    pauseMode={pauseMode}
                    setPauseMode={setPauseMode}
                    goBackMove={goBackMove}
                    goForwardMove={goForwardMove}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/Scramble" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
