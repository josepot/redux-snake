import R from 'ramda';
import { List } from 'immutable';
import { createSelector } from 'reselect';
import { OPPOSITE_DIRECTIONS } from '../reducers/directions.js';
import { getNextPosition, didHeadHitBody, getGamePosition } from '../utils';
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

export const getLastDirection = createSelector(
  [getDirections, getTick],
  (directions, currentTick) => directions.skipWhile(
    ({ tick }) => tick >= currentTick
  ).first()
);

export const getNextDirection = createSelector(
  [getDirections, getTick],
  (directions, currentTick) => {
    const nextDirections = directions.takeWhile(({ tick }) => tick >= currentTick);
    return nextDirections.size > 0 ? nextDirections.last() : directions.first();
  }
);

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
  [getHead, getSnakeKeyPositions, getLastDirection],
  ({ x, y }, keyPositions, { direction }) => x < 0 || y < 0 || x >= COLS
    || y >= ROWS || didHeadHitBody({ x, y }, keyPositions, direction)
);

const getWindowProportions = createSelector(
  [getDimensions],
  ({ width, height }) => width / height
);

const getGameRadius = createSelector(
  [getDimensions, getWindowProportions],
  ({ width, height }, windowProportions) => (
    GAME_PROPORTIONS > windowProportions ?
      width / GAME_WIDTH :
      height / GAME_HEIGHT
  ) / 2
);

const getPaddingLeft = createSelector(
  [getDimensions, getWindowProportions, getGameRadius],
  ({ width }, windowProportions, radius) => (
    GAME_PROPORTIONS > windowProportions ?
      0 :
      (width - (radius * 2 * GAME_WIDTH)) / 2
  )
);

const getGameFrame = createSelector(
  [getPaddingLeft, getGameRadius],
  (paddingLeft, radius) => ({
    x: paddingLeft,
    y: 0,
    width: GAME_WIDTH * radius * 2,
    height: GAME_HEIGHT * radius * 2,
  })
);

const getGameport = createSelector(
  [getPaddingLeft, getGameRadius],
  (paddingLeft, radius) => ({
    x: paddingLeft + (radius * 2 * MARGIN.LEFT),
    y: radius * MARGIN.TOP * 2,
    width: radius * COLS * 2,
    height: radius * ROWS * 2,
  })
);


const getGameFoodPosition = createSelector(
  [getGameport, getGameRadius, getFood],
  ({ x, y }, radius, food) => getGamePosition(food, x, y, radius)
);

const getGameSnakePositions = createSelector(
  [getSnakeKeyPositions, getGameport, getGameRadius],
  (snake, { x, y }, radius) => {
    const finalSnake = snake.size === 1 ?
      List.of(snake.first(), snake.first()) :
      snake
    ;
    return finalSnake.map(position => getGamePosition(
      position, x, y, radius
    ));
  }
);

export const ui = createSelector(
  [
    getGameStatus, getTick, getGameRadius, getGameFrame, getGameport,
    getGameFoodPosition, getDimensions, getGameSnakePositions,
  ],
  (gameStatus, tick, radius, frame, port, food, { width, height }, snake) => ({
    gameStatus,
    tick,
    radius,
    frame,
    port,
    food,
    width,
    height,
    snakePoints: snake.map(pos => `${pos.x},${pos.y}`).join(' '),
  })
);
