import { NEW_GAME, FOOD_EATEN } from '../actions.js';
import { ROWS, COLS, initialHead } from '../config.js';

const positionToIndex = (position) => (position.y * COLS) + position.x;

const indexToPosition =
  (index) => ({ y: Math.trunc(index / COLS), x: index % COLS });

const getRandomInt = (limit) => Math.floor(Math.random() * limit);

const getFoodPosition = (snakePositions) => {
  const sortedSnakePositions =
    snakePositions.map(positionToIndex).sort((a, b) => a - b);
  const nAvailablePositions = (ROWS * COLS) - sortedSnakePositions.length;
  const winner = getRandomInt(nAvailablePositions);
  return indexToPosition(sortedSnakePositions.reduce(
    (result, index) => (result >= index ? result + 1 : result),
    winner
  ));
};

const initialState = getFoodPosition([initialHead]);

export default function food(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME:
      return getFoodPosition([initialHead]);
    case FOOD_EATEN:
      return getFoodPosition(action.allSnakePositions);
    default:
      return state;
  }
}
