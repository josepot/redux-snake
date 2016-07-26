import hashFn from 'int32-fnv1a';
import { ROWS, COLS } from '../../config';

const getPseudoRandomInt = (foodOffset, limit) =>
  Math.abs(hashFn(foodOffset) % limit);

const positionToIndex = (position) => (position.y * COLS) + position.x;
const indexToPosition =
  (index) => ({ y: Math.trunc(index / COLS), x: index % COLS });

const getSnakePositionsIndexedSet = keyPositions => {
  const result = new Set();

  keyPositions.map(positionToIndex).forEach((current, idx, items) => {
    const next = items.get(idx + 1);

    if (next === undefined) return result.add(current);

    const diff = next - current;
    const increment = (Math.abs(diff) < COLS ? 1 : COLS) * (diff < 0 ? -1 : 1);

    for (let i = current; i !== next; i += increment) result.add(i);
    return true;
  });

  return result;
};

export const getFoodPosition = (foodOffset, snakeKeyPositions) => {
  const snakePositionsIndexedSet = getSnakePositionsIndexedSet(snakeKeyPositions);
  const nAvailablePositions = (ROWS * COLS) - snakePositionsIndexedSet.size;

  let winner = getPseudoRandomInt(foodOffset, nAvailablePositions);
  for (let i = 0; i <= winner; i++) {
    if (snakePositionsIndexedSet.has(i)) winner++;
  }
  return indexToPosition(winner);
};
