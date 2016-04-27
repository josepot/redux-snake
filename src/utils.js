import R from 'ramda';
import { COLS } from './config.js';

export const positionToIndex = (position) => (position.y * COLS) + position.x;
export const indexToPosition = (index) => ({
  y: Math.trunc(index / COLS),
  x: index % COLS,
});

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

export const evolvePosition = (position, direction, increment = 1) => R.evolve(
  getMovementTransformation(direction, increment),
  position
);

export const isNumberBetween = (testNumber, a, b) => {
  const { min, max } = a < b ? { min: a, max: b } : { min: b, max: a };
  return testNumber >= min && testNumber <= max;
};

