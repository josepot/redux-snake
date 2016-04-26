import R from 'ramda';
import { List } from 'immutable';
import { createSelector } from 'reselect';
import { OPPOSITE_DIRECTIONS } from '../reducers/directions.js';
import { getNextPosition, didHeadHitBody } from '../utils';
import { COLS, ROWS, MARGIN } from '../config';

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

/*
 *  In a case like the following, where the snake is moving towards the left:
 *
 *    0 1 2 3 4 5
 *    _ _ _ _ _ _
 * 0 | | | | | | |
 * 1 | |x|x|x| | |
 * 2 | | | |x| | |
 * 3 | | | |x| | |
 * 4 | | | |x|x|x|
 * 5 | | | | | | |
 *    ‾ ‾ ‾ ‾ ‾ ‾
 *  It should return: [
 *    { direction: 'LEFT', len: 2 },
 *    { direction: 'UP', len: 3 },
 *    { direction: 'LEFT', len: 2 },
 *  ]
 *  Notice that the sum of the len of the vectors will always be one unit less
 *  than the body length. This is because the vectors are from the head of the snake.
 * */
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

/*
 *  In a case like this:
 *
 *  x 0 1 2 3 4 5
 * y  _ _ _ _ _ _
 * 0 | | | | | | |
 * 1 | |x|x|x| | |
 * 2 | | | |x| | |
 * 3 | | | |x| | |
 * 4 | | | |x|x|x|
 * 5 | | | | | | |
 *    ‾ ‾ ‾ ‾ ‾ ‾
 *  It should return: [
 *    { x: 1, y: 1 },
 *    { x: 3, y: 1 },
 *    { x: 3, y: 4 },
 *    { x: 5, y: 4 }
 *  ]
 * */
const _getSnakeKeyPositions =
  (vectors, head) => vectors.reduce((prev, cur) => prev.push(getNextPosition(
    prev.last(), OPPOSITE_DIRECTIONS[cur.direction], cur.len
  )), List.of(head));

export const getSnakeKeyPositions =
  createSelector([getSnakeVectors, getHead], _getSnakeKeyPositions);

const _getAllSnakePositions =
  (vectors, head) => vectors.reduce((prev, { len, direction }) => prev.concat(
    ...R.range(0, len).map((inc) => getNextPosition(
      R.last(prev), OPPOSITE_DIRECTIONS[direction], inc + 1
    ))
  ), [head]);

export const getAllSnakePositions =
  createSelector([getSnakeVectors, getHead], _getAllSnakePositions);

export const didSnakeCrash = createSelector(
  [getHead, getSnakeKeyPositions],
  ({ x, y }, keyPositions) => x < 0 || y < 0 || x >= COLS
    || y >= ROWS || didHeadHitBody({ x, y }, keyPositions)
);

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

export const getCurrentDirection = createSelector(
  [getDirections, getTick],
  (directions, currentTick) => {
    const nextDirections = directions.takeWhile(({ tick }) => tick >= currentTick);
    return nextDirections.size > 0 ? nextDirections.last() : directions.first();
  }
);
