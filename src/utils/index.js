import R from 'ramda';
import { COLS, ROWS } from '../config';

export const positionToIndex = (position) => (position.y * COLS) + position.x;
export const indexToPosition = (index) => ({
  y: Math.trunc(index / COLS),
  x: index % COLS,
});

export const checkCollission =
  (head) => head.x < 0 || head.y < 0 || head.x > COLS || head.y > ROWS;


const getMovementTransformation = (direction, increment) => {
  const add = R.add(increment);
  const sub = R.add(0 - increment);
  const movements = {
    UP: { y: sub },
    DOWN: { y: add },
    LEFT: { x: sub },
    RIGHT: { x: add },
  };
  return movements[direction];
};

export const getNextPosition = (position, direction, increment = 1) => R.evolve(
  getMovementTransformation(direction, increment),
  position
);

const isNumberBetween = (testNumber, a, b) => {
  const { min, max } = a < b ? { min: a, max: b } : { min: b, max: a };
  return testNumber >= min && testNumber <= max;
};

export const didHeadHitBody = (head, keyPositions) =>
  keyPositions.skip(3).some((current, idx, items) => {
    const next = items.get(idx + 1);
    if (next === undefined) return false;
    const { constant, variable } = current.x === next.x ?
      { constant: 'x', variable: 'y' } : { constant: 'y', variable: 'x' };

    return head[constant] === current[constant] &&
      isNumberBetween(head[variable], current[variable], next[variable]);
  });
