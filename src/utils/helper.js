export const convertStrMoveToObj = (move) => {
  let side = move[0];
  let rotations = parseInt(move[move.length - 1]);
  let prime = move.includes("'");
  let move_obj = { side: side, rotations: rotations, prime: prime };
  return move_obj;
};

export const equalObjs = (move1, move2) => {
  return JSON.stringify(move1) === JSON.stringify(move2);
};
