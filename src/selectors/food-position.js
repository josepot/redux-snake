import hashFn from 'int32-fnv1a';

import createSelectorTrackingArguments from '../utils/create-selector-tracking-arguments';
import { getFoodRandomizer, getSnake } from './raw-selectors';
import { ROWS, COLS } from '../config';

const positionToIndex = position => (position.y * COLS) + position.x;
const indexToPosition =
  (index) => ({ y: Math.trunc(index / COLS), x: index % COLS });
const getPseudoRandomInt = (foodOffset, limit) =>
  Math.abs(hashFn(foodOffset) % limit);

const foodPositionCombiner = (randomizer, snake) => {
  const nAvailablePositions = (ROWS * COLS) - snake.size;
  let winner = getPseudoRandomInt(randomizer, nAvailablePositions);

  const snakePositionsIndexedSet = snake
    .map(positionToIndex)
    .reduce((result, indexedPosition) => {
      result.add(indexedPosition);
      return result;
    }, new Set());

  for (let i = 0; i <= winner; i++) {
    if (snakePositionsIndexedSet.has(i)) winner++;
  }
  return indexToPosition(winner);
};

export default createSelectorTrackingArguments([0])(
  [getFoodRandomizer, getSnake],
  foodPositionCombiner
);
