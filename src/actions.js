import R from 'ramda';
import { didSnakeCrash, getAllSnakePositions, getCurrentDirection } from './selectors.js';

export const NEW_GAME = 'NEW_GAME';
export const NEW_DIRECTION = 'NEW_DIRECTION';
export const FOOD_EATEN = 'FOOD_EATEN';
export const TICK = 'TICK';
export const COLLISION = 'COLLISION';
export const PAUSE = 'PAUSE';
export const RESUME = 'RESUME';
export const RESIZE = 'RESIZE';

export function newGame() {
  return { type: NEW_GAME };
}

export function pause() {
  return { type: PAUSE };
}

export function resize(width, height) {
  return { type: RESIZE, width, height };
}

export function resume() {
  return { type: RESUME };
}

export function newDirection(direction, tickNumber) {
  return { type: NEW_DIRECTION, direction, tick: tickNumber };
}

export function tick() {
  return (dispatch, getState) => {
    const { direction } = getCurrentDirection(getState());
    dispatch({ type: TICK, direction });

    const { head, food } = getState();

    if (R.equals(head, food)) {
      dispatch({
        type: FOOD_EATEN,
        allSnakePositions: getAllSnakePositions(getState()),
      });
    } else if (didSnakeCrash(getState())) {
      dispatch({ type: COLLISION });
    }
  };
}
