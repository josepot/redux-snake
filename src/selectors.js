import R from 'ramda';
import { List } from 'immutable';
import { createSelector } from 'reselect';
import { OPPOSITE_DIRECTIONS } from './reducers/directions.js';
import evolvePosition from './evolve-position.js';
import { COLS, ROWS, MARGIN, GROWTH_FACTOR } from './config.js';

const GAME_WIDTH = (COLS + MARGIN.LEFT + MARGIN.RIGHT);
const GAME_HEIGHT = (ROWS + MARGIN.TOP + MARGIN.BOTTOM);
const GAME_PROPORTIONS = GAME_WIDTH / GAME_HEIGHT;

const getDirections = R.path(['directions']);
const getTick = R.path(['tickNumber']);
const getGameStatus = R.path(['gameStatus']);
const getCollectedFood = R.path(['collectedFood']);
const getHead = R.path(['head']);
const getDimensions = R.path(['dimensions']);
const getFood = R.path(['food']);

export const getCurrentBodyLengthBuffer = createSelector(
  [getCollectedFood, getTick],
  (eaten, tick) => (eaten.size === 0 ? 0 :
    eaten.last().buffer + R.max(0, GROWTH_FACTOR - (tick - eaten.last().tick))
  )
);

const getBodyLength = createSelector(
  [getCollectedFood, getCurrentBodyLengthBuffer],
  (eaten, buffer) => (eaten.size * GROWTH_FACTOR) - buffer
);

const getMinimumTick = createSelector([getTick, getBodyLength], R.subtract);

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
  (vectors, head) => vectors.reduce((prev, cur) => prev.push(evolvePosition(
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
  (gameStatus, tick, food, snakeKeyPositions, { width, height }) => (
    { gameStatus, tick, food, snakeKeyPositions, width, height }
  )
);

const _getAllSnakePositions =
  (vectors, head) => vectors.reduce((prev, { len, direction }) => prev.concat(
    ...R.range(0, len).map((inc) => evolvePosition(
      R.last(prev), OPPOSITE_DIRECTIONS[direction], inc + 1
    ))
  ), [head]);
export const getAllSnakePositions =
  createSelector([getSnakeVectors, getHead], _getAllSnakePositions);

const isHeadOutOfBounds =
  ({ x, y }) => x < 0 || y < 0 || x >= COLS || y >= ROWS;

const didHeadHitBody = (head, keyPositions) =>
  keyPositions.skip(3).some((current, idx, items) => {
    const next = items.get(idx + 1);
    if (next === undefined) return false;
    const { constProp, varProp } = current.x === next.x ?
      { constProp: 'x', varProp: 'y' } : { constProp: 'y', varProp: 'x' };
    const { min, max } = current[varProp] < next[varProp] ?
      { min: current, max: next } : { min: next, max: next };

    return head[constProp] === current[constProp] &&
      head[varProp] >= min[varProp] && head[varProp] <= max[varProp];
  });

export const didSnakeCrash = createSelector(
  [getHead, getSnakeKeyPositions], R.either(isHeadOutOfBounds, didHeadHitBody)
);

export const getCurrentDirection = createSelector(
  [getDirections, getTick],
  (directions, currentTick) => {
    const unprocessed = directions.takeWhile(({ tick }) => tick >= currentTick);
    return unprocessed.size > 0 ? unprocessed.last() : directions.first();
  }
);
