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

export const isEmptyObject = (obj) => {
  if (obj === undefined || obj === null) return true;

  return Object.keys(obj).length === 0;
};

export const combineMoves = (move, current_move) => {
  if (isEmptyObject(current_move)) return move;

  if (move.side === current_move.side) {
    let move_rotations = move.prime ? -move.rotations : move.rotations;
    let current_move_rotations = current_move.prime
      ? -current_move.rotations
      : current_move.rotations;
    let updated_rotations = move_rotations + current_move_rotations;
    if (updated_rotations < 0) {
      move.prime = true;
      move.rotations = Math.abs(updated_rotations);
    } else {
      move.prime = false;
      move.rotations = updated_rotations;
    }
  }
  return move;
};
