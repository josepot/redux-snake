import R from 'ramda';
import { createSelector, createStructuredSelector } from 'reselect';

import { ROWS, COLS } from '../config';
import { getSnake } from './raw-selectors';
import getFoodPosition from './food-position';
import getSnakeKeyPoints from './snake-key-points';

const getHead = createSelector([getSnake], snake => snake.first());

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

export const isHeadOutOfBounds = ({ x, y }) =>
  x < 0 || y < 0 || x >= COLS || y >= ROWS;

const didSnakeCrash = createSelector(
  [getHead, getSnakeKeyPoints],
  R.either(isHeadOutOfBounds, didHeadHitBody)
);

const isFoodEaten = createSelector(
  [getFoodPosition, getHead],
  R.equals
);

export default createStructuredSelector({ didSnakeCrash, isFoodEaten });
