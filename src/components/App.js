import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import RubiksCube from "./RubiksCube";
import styles from "../styles/App.module.css";

function App() {
  const [activeSide, setActiveSide] = useState("");
  const [movesQueue, setMovesQueue] = useState([]);
  const [isMoveDone, setMoveDone] = useState(false);

  const numRotations = useRef(0);
  const isMounted = useRef(false);
  const firstMove = useRef(false);

  const updateRotation = (side, num_rotations = 1) => {
    setActiveSide(side);
    numRotations.current += num_rotations;
  };

  const resetRotation = useCallback(() => {
    setActiveSide("");
    numRotations.current = 0;
  }, []);

  const enqueueItem = useCallback((item) => {
    return new Promise((resolve) => {
      setMovesQueue((prevQueue) => {
        // Check if the movesQueue is not empty and the last item has the same key as the new item
        let newQueue;
        if (
          prevQueue.length > 0 &&
          prevQueue[prevQueue.length - 1].side === item
        ) {
          // Get the last item in the previous queue and increment its value by 1
          const lastItem = prevQueue[prevQueue.length - 1];
          newQueue = [
            ...prevQueue.slice(0, -1),
            { side: item, rotations: lastItem.rotations + 1 },
          ];
        } else {
          // Otherwise, add the new item with a value of 1 to the end of the queue
          newQueue = [...prevQueue, { side: item, rotations: 1 }];
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

  const scramble = useCallback(async () => {
    firstMove.current = true;
    const items = ["F", "B", "L", "R", "U", "D"];
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomMove = items[randomIndex];
      enqueueItem(randomMove, 1);
    }
  }, [enqueueItem]);

  useEffect(() => {
    if (!isMounted.current) return;

    if (firstMove.current || isMoveDone) {
      if (movesQueue.length !== 0) {
        try {
          dequeueItem()
            .then((move) => {
              updateRotation(move.side, move.rotations);
            })
            .catch((error) => console.error(error));
        } catch (error) {}
      }
      firstMove.current = false;
      setMoveDone(false);
    }
  }, [isMoveDone, firstMove.current]);

  useEffect(() => {
    isMounted.current = true;
  });

  return (
    <div>
      <div className={styles["background"]}>
        <div className={styles["rubiks-cube"]}>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <RubiksCube
              activeSide={activeSide}
              numRotations={numRotations}
              resetRotation={resetRotation}
              setMoveDone={(state) => setMoveDone(state)}
            />
          </Canvas>
        </div>

        <div className={styles["rotate-btns"]}>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("F")}>F</button>
            <button onClick={() => updateRotation("F'")}>F'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("B")}>B</button>
            <button onClick={() => updateRotation("B'")}>B'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("L")}>L</button>
            <button onClick={() => updateRotation("L'")}>L'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("R")}>R</button>
            <button onClick={() => updateRotation("R'")}>R'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("U")}>U</button>
            <button onClick={() => updateRotation("U'")}>U'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => updateRotation("D")}>D</button>
            <button onClick={() => updateRotation("D'")}>D'</button>
          </div>
          <div className={styles["btn-group"]}>
            <button onClick={() => scramble()}>Scramble</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
