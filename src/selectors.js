import R from 'ramda';
import { List } from 'immutable';
import { createSelector } from 'reselect';
import { OPPOSITE_DIRECTIONS } from './reducers/directions.js';
import { getNextPosition, isNumberBetween } from './utils.js';
import { COLS, ROWS, MARGIN } from './config.js';

const GAME_WIDTH = (COLS + MARGIN.LEFT + MARGIN.RIGHT);
const GAME_HEIGHT = (ROWS + MARGIN.TOP + MARGIN.BOTTOM);
const GAME_PROPORTIONS = GAME_WIDTH / GAME_HEIGHT;

const getDirections = R.path(['directions']);
const getTick = R.path(['tickNumber']);
const getGameStatus = R.path(['gameStatus']);
const getSnakeLength = R.path(['snakeLength', 'current']);
const getHead = R.path(['head']);
const getDimensions = R.path(['dimensions']);
const getFood = R.path(['food']);

const getMinimumTick = createSelector([getTick, getSnakeLength], R.subtract);

const _getSnakeVectors =
  (latestTick, directions, minTick) => directions.skipUntil(
    ({ tick }) => tick < latestTick
  ).takeUntil(
  ({ tick }, idx, items) => {
    const prev = idx > 0 ? items.get(idx - 1) : undefined;
    return tick < minTick && prev !== undefined && prev.tick <= minTick;
  }).map(({ tick, direction }, i, items) => {
    const prevTick = i === 0 ? latestTick : items.get(i - 1).tick;
    return { direction, len: prevTick - R.max(tick, minTick) };
  });
export const getSnakeVectors =
  createSelector([getTick, getDirections, getMinimumTick], _getSnakeVectors);

const _getSnakeKeyPositions =
  (vectors, head) => vectors.reduce((prev, cur) => prev.push(getNextPosition(
    prev.last(), OPPOSITE_DIRECTIONS[cur.direction], cur.len
  )), List.of(head));
export const getSnakeKeyPositions =
  createSelector([getSnakeVectors, getHead], _getSnakeKeyPositions);

const getWidthHeight = createSelector(
  [getDimensions],
  ({ width, height }) => {
    const windowProportions = width / height;
    return windowProportions > GAME_PROPORTIONS ? {
      width: height * GAME_PROPORTIONS,
      height,
    } : {
      width,
      height: width / GAME_PROPORTIONS,
    };
  }
);

export const ui = createSelector(
  [
    getGameStatus, getTick, getFood, getSnakeKeyPositions, getWidthHeight,
  ],
  (gameStatus, tick, food, snakeKeyPositions, { width, height }) => ({
    gameStatus,
    tick,
    food,
    snakeKeyPositions,
    width,
    height,
  })
);

const _getAllSnakePositions =
  (vectors, head) => vectors.reduce((prev, { len, direction }) => prev.concat(
    ...R.range(0, len).map((inc) => getNextPosition(
      R.last(prev), OPPOSITE_DIRECTIONS[direction], inc + 1
    ))
  ), [head]);
export const getAllSnakePositions =
  createSelector([getSnakeVectors, getHead], _getAllSnakePositions);

const isHeadOutBounds = ({ x, y }) => x < 0 || y < 0 || x >= COLS || y >= ROWS;

const didHeadHitBody = (head, keyPositions) =>
  keyPositions.skip(3).some((current, idx, items) => {
    const next = items.get(idx + 1);
    if (next === undefined) return false;
    const { constProp, varProp } = current.x === next.x ?
      { constProp: 'x', varProp: 'y' } : { constProp: 'y', varProp: 'x' };

    return head[constProp] === current[constProp] &&
      isNumberBetween(head[varProp], current[varProp], next[varProp]);
  });

export const didSnakeCrash = createSelector(
  [getHead, getSnakeKeyPositions], R.either(isHeadOutBounds, didHeadHitBody)
);

export const getCurrentDirection = createSelector(
  [getDirections, getTick],
  (directions, currentTick) => {
    const unprocessed = directions.takeWhile(({ tick }) => tick >= currentTick);
    return unprocessed.size > 0 ? unprocessed.last() : directions.first();
  }
);
