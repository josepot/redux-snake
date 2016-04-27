import R from 'ramda';
import { NEW_GAME, TICK, COLLISION } from '../actions.js';

export const initialState = 0;

export default function tickNumer(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case TICK:
      return R.inc(state);
    case COLLISION:
      return R.dec(state);
    default:
      return state;
  }
}
