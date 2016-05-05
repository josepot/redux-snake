import R from 'ramda';
import { List } from 'immutable';
import { createSelector } from 'reselect';
import { OPPOSITE_DIRECTIONS } from './reducers/directions-stack.js';
import evolvePosition from './evolve-position.js';
import { COLS, ROWS, MARGIN, GROWTH_FACTOR, initialHead } from './config.js';

const GAME_WIDTH = (COLS + MARGIN.LEFT + MARGIN.RIGHT);
const GAME_HEIGHT = (ROWS + MARGIN.TOP + MARGIN.BOTTOM);
const GAME_PROPORTIONS = GAME_WIDTH / GAME_HEIGHT;

const getCurrentMoment = R.path(['currentMoment']);
const getDimensions = R.path(['dimensions']);
const getDirectionsStack = R.path(['directionsStack']);
const getFoodEaten = R.path(['foodEaten']);
const getFoodPosition = R.path(['foodPosition']);
const getGameStatus = R.path(['gameStatus']);
const getGrowthBuffer = R.path(['growthBuffer', 'buffer']);

const getBodyLength = createSelector(
  [getFoodEaten, getGrowthBuffer],
  (eaten, buffer) => (eaten * GROWTH_FACTOR) - buffer
);

const getMinMoment =
  createSelector([getCurrentMoment, getBodyLength], R.subtract);

export const getHead = createSelector(
  [getCurrentMoment, getDirectionsStack],
  (currentMoment, directions) => {
    if (directions.size === 0) return initialHead;

    const { position, direction, moment } =
      directions.skipUntil((d) => d.moment <= currentMoment).first();
    return evolvePosition(position, direction, currentMoment - moment);
  }
);

const _getSnakeVectors =
  (currentMoment, directions, minMoment) => directions.skipUntil(
    ({ moment }) => moment < currentMoment
  ).takeUntil(
  ({ moment }, idx, items) => {
    const prev = idx > 0 ? items.get(idx - 1) : undefined;
    return moment < minMoment && prev !== undefined && prev.moment <= minMoment;
  }).toArray().map(({ moment, direction }, i, items) => {
    const prevMoment = i === 0 ? currentMoment : items[i - 1].moment;
    return { direction, len: prevMoment - R.max(moment, minMoment) };
  });
export const getSnakeVectors = createSelector(
  [getCurrentMoment, getDirectionsStack, getMinMoment], _getSnakeVectors
);

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
    getGameStatus, getCurrentMoment, getFoodPosition,
    getSnakeKeyPositions, getWidthHeight,
  ],
  (gameStatus, currentMoment, food, snakeKeyPositions, { width, height }) => (
    { gameStatus, currentMoment, food, snakeKeyPositions, width, height }
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
  [getDirectionsStack, getCurrentMoment],
  (directions, currentMoment) => {
    const unprocessed =
      directions.takeWhile(({ moment }) => moment >= currentMoment);
    return unprocessed.size > 0 ? unprocessed.last() : directions.first();
  }
);
