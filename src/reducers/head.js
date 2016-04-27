import { COLS, ROWS } from '../config.js';
import { NEW_GAME, TICK, COLLISION } from '../actions.js';
import evolvePosition from '../evolve-position.js';

export const initialHead = {
  x: Math.trunc(COLS / 2),
  y: Math.trunc(ROWS / 2),
};

export default function head(state = initialHead, action) {
  switch (action.type) {
    case NEW_GAME:
      return initialHead;
    case TICK:
      return evolvePosition(state, action.direction, 1);
    case COLLISION:
      return evolvePosition(state, action.direction, -1);
    default:
      return state;
  }
}
