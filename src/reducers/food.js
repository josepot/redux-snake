import R from 'ramda';
import { NEW_GAME, FOOD_EATEN } from '../actions';
import { ROWS, COLS } from '../config';
import { initialHead } from './head.js';
import { positionToIndex, indexToPosition } from '../utils';

const getRandomInt = (limit) => Math.floor(Math.random() * limit);
const getFoodPosition = (snakePositions) => {
  const sortedSnakePositions = R.sort(R.gt, snakePositions.map(positionToIndex));
  const nAvailablePositions = (ROWS * COLS) - sortedSnakePositions.length;
  let winner = getRandomInt(nAvailablePositions);
  for (let i = 0; sortedSnakePositions[i] <= winner; i++) {
    winner++;
  }
  return indexToPosition(winner);
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
