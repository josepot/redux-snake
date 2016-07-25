import R from 'ramda';
import { createSelector } from 'reselect';

import createSelectorTrackingArguments from '../utils/create-selector-tracking-arguments';
import getFoodPosition$ from '../utils/get-food-position';
import evolvePosition from '../utils/evolve-position';
import { COLS, ROWS, GROWTH_FACTOR, initialHead } from '../config';

export const getCurrentMoment = R.path(['currentMoment']);
const getDirectionsStack = R.path(['directionsStack']);
const getFoodEaten = R.path(['foodEaten']);
const getGrowthBuffer = R.path(['growthBuffer', 'current']);

const getBodyLength = createSelector(
  [getFoodEaten, getGrowthBuffer],
  (eaten, buffer) => (eaten * GROWTH_FACTOR) - buffer
);

// The moment when the head of the snake was in the position of the current tail
const getTailMoment = createSelector(
  [getCurrentMoment, getBodyLength],
  R.subtract
);

const getRelevantDirections$ = (currentMoment, tailMoment, directions) => {
  const isFutureDirection = R.compose(
    x => x > currentMoment, R.prop('moment')
  );

  const isTailsDirection = ({ moment }, idx, items) => {
    const prev = idx > 0 ? items.get(idx - 1) : null;
    return moment < tailMoment && prev !== null && prev.moment <= tailMoment;
  };

  return directions
    .skipWhile(isFutureDirection)
    .takeUntil(isTailsDirection)
    .toList();
};
const getRelevantDirections = createSelector(
  [getCurrentMoment, getTailMoment, getDirectionsStack],
  getRelevantDirections$
);

const getHead$ = (currentMoment, relevantDirections) => {
  if (relevantDirections.isEmpty()) return initialHead;

  const currentDirection = relevantDirections.first();
  return evolvePosition(
    currentDirection.position,
    currentDirection.direction,
    currentMoment - currentDirection.moment
  );
};
export const getHead = createSelector(
  [getCurrentMoment, getRelevantDirections],
  getHead$
);

const getTail$ = (tailMoment, relevantDirections) => {
  if (relevantDirections.isEmpty()) return initialHead;

  const lastDirection = relevantDirections.last();
  return evolvePosition(
    lastDirection.position,
    lastDirection.direction,
    tailMoment - lastDirection.moment
  );
};
export const getTail = createSelector(
  [getTailMoment, getRelevantDirections],
  getTail$
);

const getSnakeKeyPositions$ = (head, tail, relevantDirections) => {
  const result = relevantDirections.pop().map(R.prop('position')).push(tail);

  return R.equals(head, result.first()) ?
    result :
    result.unshift(head);
};
export const getSnakeKeyPositions = createSelector(
  [getHead, getTail, getRelevantDirections],
  getSnakeKeyPositions$
);

const isHeadOutOfBounds = ({ x, y }) => x < 0 || y < 0 || x >= COLS || y >= ROWS;

const didHeadHitBody = (head, keyPositions) =>
  keyPositions.skip(3).some((current, idx, items) => {
    const next = items.get(idx + 1);
    if (next === undefined) return false;

    const [constProp, varProp] = current.x === next.x ?
      ['x', 'y'] :
      ['y', 'x'];
    const [min, max] = current[varProp] < next[varProp] ?
      [current, next] :
      [next, current];

    return head[constProp] === current[constProp] &&
      head[varProp] >= min[varProp] && head[varProp] <= max[varProp];
  });

export const getIsThereCollision = createSelector(
  [getHead, getSnakeKeyPositions],
  R.either(isHeadOutOfBounds, didHeadHitBody)
);

const getFoodGeneratorOffset = R.prop('foodGeneratorOffset');

export const getFoodPosition = createSelectorTrackingArguments([0])(
  [getFoodGeneratorOffset, getSnakeKeyPositions],
  getFoodPosition$
);

export const getIsFoodEaten = createSelector(
  [getFoodPosition, getHead],
  R.equals
);
