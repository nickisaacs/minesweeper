import set from "lodash/set";
import get from "lodash/get";

export const getNewBoard = ({ rows = 10, cols = 10, mines = 15 }) => {
  if (mines > rows * cols) {
    throw new Error("You cant have more mines than cells!");
  }
  let board = [];
  const mineLocations = [];
  while (mineLocations.length < mines) {
    const randomLocation = Math.floor(Math.random() * (rows * cols));
    if (mineLocations.indexOf(randomLocation) > -1) continue;
    mineLocations[mineLocations.length] = randomLocation;
  }
  mineLocations.forEach(mineLocation => {
    let row = parseInt(mineLocation / cols, 10);
    let col = mineLocation - row * cols;
    board = set(board, [row, col, "isMine"], true);
  });
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = get(board, [i, j]);
      const neighbours = getNeighbours(i, j, board);
      let neighbourMineCount = 0;
      neighbours.forEach(neighbour => {
        const isMine = get(neighbour, ["isMine"]);
        if (isMine) {
          neighbourMineCount++;
        }
      });
      board = set(board, [i, j], {
        ...cell,
        neighbourMineCount,
        row: i,
        col: j
      });
    }
  }
  return board;
};

export const getNeighbours = (row, col, board) => {
  const neighbours = [];

  neighbours.push(get(board, [row - 1, col]));

  neighbours.push(get(board, [row + 1, col]));

  neighbours.push(get(board, [row, col - 1]));

  neighbours.push(get(board, [row, col + 1]));

  neighbours.push(get(board, [row - 1, col - 1]));

  neighbours.push(get(board, [row - 1, col + 1]));

  neighbours.push(get(board, [row + 1, col + 1]));

  neighbours.push(get(board, [row + 1, col - 1]));
  return neighbours;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
