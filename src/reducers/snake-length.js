import R from 'ramda';
import { GROWTH_FACTOR } from '../config';
import { NEW_GAME, TICK, FOOD_EATEN } from '../actions';

const initialState = {
  current: 0,
  buffer: 0,
};

export default function snakeLength(state = initialState, action) {
  const { buffer } = state;
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case TICK:
      return buffer > 0 ?
        R.evolve({ current: R.inc, buffer: R.dec }, state) :
        state;
    case FOOD_EATEN:
      return R.evolve({ buffer: R.add(GROWTH_FACTOR) }, state);
    default:
      return state;
  }
}
