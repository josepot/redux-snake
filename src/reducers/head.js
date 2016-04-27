import { COLS, ROWS } from '../config.js';
import { NEW_GAME, TICK } from '../actions.js';
import { getNextPosition } from '../utils.js';

export const initialHead = {
  x: Math.trunc(COLS / 2),
  y: Math.trunc(ROWS / 2),
};

export default function head(state = initialHead, action) {
  switch (action.type) {
    case NEW_GAME:
      return initialHead;
    case TICK:
      return getNextPosition(state, action.direction);
    default:
      return state;
  }
}
