import R from 'ramda';
import { NEW_GAME, FOOD_EATEN, TICK, COLLISION } from '../actions.js';
import { GROWTH_FACTOR } from '../config.js';

const initialState = {
  buffer: 0,
  latestIncrement: NaN,
};

const decreaseUntilZero = R.pipe(R.dec, R.max(0));

export default function growthBuffer(state = initialState, action) {
  const { moment } = action;
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case FOOD_EATEN:
      return { buffer: state.buffer + GROWTH_FACTOR, latestIncrement: moment };
    case TICK:
      return R.evolve({ buffer: decreaseUntilZero }, state);
    case COLLISION:
      return moment - GROWTH_FACTOR <= state.latestIncrement ?
        R.evolve({ buffer: R.inc }, state) : state;
    default:
      return state;
  }
}
