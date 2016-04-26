import R from 'ramda';
import { COLS, ROWS } from '../config';
import { LEFT, RIGHT } from '../reducers/directions.js';

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
  const lowerEnd = R.min(a, b);
  const higherEnd = R.max(a, b);
  return testNumber >= lowerEnd && testNumber <= higherEnd;
};

const getRelevantProperties = (lastDirection, idx) => {
  const horizontal = { constant: 'y', variable: 'x' };
  const vertical = { constant: 'x', variable: 'y' };
  const { first, second } = [LEFT, RIGHT].includes(lastDirection) ?
    { first: vertical, second: horizontal } :
    { first: horizontal, second: vertical };
  return idx % 2 === 0 ? first : second;
};

export const didHeadHitBody = (head, keyPositions, lastDirection) =>
  keyPositions.skip(3).some((current, idx, items) => {
    const next = items.get(idx + 1);
    if (next === undefined) return false;
    const { constant, variable } = getRelevantProperties(lastDirection, idx);
    return head[constant] === current[constant] &&
      isNumberBetween(head[variable], current[variable], next[variable]);
  });
