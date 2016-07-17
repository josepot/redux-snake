import R from 'ramda';
import { List } from 'immutable';
import { createSelector } from 'reselect';

import { OPPOSITE_DIRECTIONS } from '../constants';
import evolvePosition from '../utils/evolve-position';
import { COLS, ROWS, GROWTH_FACTOR, initialHead } from '../config';

const getCurrentMoment = R.path(['currentMoment']);
const getDirectionsStack = R.path(['directionsStack']);
const getFoodEaten = R.path(['foodEaten']);
export const getFoodPosition = R.path(['foodPosition']);
const getGrowthBuffer = R.path(['growthBuffer', 'value']);

const getBodyLength = createSelector(
  [getFoodEaten, getGrowthBuffer],
  (eaten, buffer) => (eaten * GROWTH_FACTOR) - buffer
);

const getMinMoment = createSelector(
  [getCurrentMoment, getBodyLength],
  R.subtract
);

const getHead$ = (currentMoment, directions) => {
  if (directions.size === 0) return initialHead;

  const directionMomentIsSmallerOrEqualCurrentMoment = R.compose(
    R.gte(currentMoment), R.prop('moment')
  );
  const { position, direction, moment: directionMoment } =
    directions.skipUntil(directionMomentIsSmallerOrEqualCurrentMoment).first();
  return evolvePosition(position, direction, currentMoment - directionMoment);
};

export const getHead = createSelector(
  [getCurrentMoment, getDirectionsStack],
  getHead$
);

const getSnakeVectors$ =
  (currentMoment, directions, minMoment) => directions.skipUntil(
    ({ moment }) => moment < currentMoment
  ).takeUntil(
  ({ moment }, idx, items) => {
    const prev = idx > 0 ? items.get(idx - 1) : undefined;
    return moment < minMoment && prev !== undefined && prev.moment <= minMoment;
  }).toArray()
    .map(({ moment, direction }, i, items) => {
      const prevMoment = i === 0 ? currentMoment : items[i - 1].moment;
      return {
        direction: OPPOSITE_DIRECTIONS[direction],
        len: prevMoment - R.max(moment, minMoment),
      };
    });
const getSnakeVectors = createSelector(
  [getCurrentMoment, getDirectionsStack, getMinMoment],
  getSnakeVectors$
);

const getSnakeKeyPositions$ =
  (vectors, head) => vectors.reduce((prev, cur) => prev.push(evolvePosition(
    prev.last(), cur.direction, cur.len
  )), List.of(head));

export const getSnakeKeyPositions = createSelector(
  [getSnakeVectors, getHead],
  getSnakeKeyPositions$
);

const getSnakePositions$ =
  (vectors, head) => vectors.reduce((prev, { len, direction }) => prev.concat(
    ...R.range(0, len).map((inc) => evolvePosition(
      R.last(prev), direction, inc + 1
    ))
  ), [head]);
export const getSnakePositions = createSelector(
  [getSnakeVectors, getHead],
  getSnakePositions$
);

const isHeadOutOfBounds = ({ x, y }) => x < 0 || y < 0 || x >= COLS || y >= ROWS;

const didHeadHitBody = (head, keyPositions) =>
  keyPositions.skip(3).some((current, idx, items) => {
    const next = items.get(idx + 1);
    if (next === undefined) return false;
    const { constProp, varProp } = current.x === next.x ?
      { constProp: 'x', varProp: 'y' } : { constProp: 'y', varProp: 'x' };
    const { min, max } = current[varProp] < next[varProp] ?
      { min: current, max: next } : { min: next, max: current };

    return head[constProp] === current[constProp] &&
      head[varProp] >= min[varProp] && head[varProp] <= max[varProp];
  });

export const getIsThereCollision = createSelector(
  [getHead, getSnakeKeyPositions],
  R.either(isHeadOutOfBounds, didHeadHitBody)
);

export const getIsFoodEaten = createSelector(
  [getFoodPosition, getHead],
  R.equals
);
