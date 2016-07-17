import { ROWS, COLS } from '../config';

const positionToIndex = (position) => (position.y * COLS) + position.x;

const indexToPosition =
  (index) => ({ y: Math.trunc(index / COLS), x: index % COLS });

const getRandomInt = (limit) => Math.floor(Math.random() * limit);

export default snakePositions => {
  const sortedSnakePositions =
    snakePositions.map(positionToIndex).sort((a, b) => a - b);
  const nAvailablePositions = (ROWS * COLS) - sortedSnakePositions.length;
  const winner = getRandomInt(nAvailablePositions);
  return indexToPosition(sortedSnakePositions.reduce(
    (result, index) => (result >= index ? result + 1 : result),
    winner
  ));
};
