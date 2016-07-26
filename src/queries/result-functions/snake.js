import R from 'ramda';
import evolvePosition from '../../utils/evolve-position';
import { COLS, ROWS, GROWTH_FACTOR, initialHead } from '../../config';

export const getBodyLength = (eaten, buffer) => (eaten * GROWTH_FACTOR) - buffer;

export const getRelevantDirections = (currentMoment, tailMoment, directions) => {
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

export const getHead = (currentMoment, relevantDirections) => {
  if (relevantDirections.isEmpty()) return initialHead;

  const currentDirection = relevantDirections.first();
  return evolvePosition(
    currentDirection.position,
    currentDirection.direction,
    currentMoment - currentDirection.moment
  );
};

export const getTail = (tailMoment, relevantDirections) => {
  if (relevantDirections.isEmpty()) return initialHead;

  const lastDirection = relevantDirections.last();
  return evolvePosition(
    lastDirection.position,
    lastDirection.direction,
    tailMoment - lastDirection.moment
  );
};

export const getSnakeKeyPositions = (head, tail, relevantDirections) => {
  const result = relevantDirections.pop().map(R.prop('position')).push(tail);

  return R.equals(head, result.first()) ?
    result :
    result.unshift(head);
};

export const isHeadOutOfBounds = ({ x, y }) =>
  x < 0 || y < 0 || x >= COLS || y >= ROWS;

export const didHeadHitBody = (head, keyPositions) =>
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
