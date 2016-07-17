import R from 'ramda';
import { GAME } from '../actions';
import { GROWTH_FACTOR } from '../config';

const initialState = {
  value: 0,
  latestIncrement: NaN,
};

const decreaseUntilZero = R.pipe(R.dec, R.max(0));

export default (state = initialState, { type, payload: { moment } = {} }) =>
  R.propOr(R.identity, type, {
    [GAME.NEW]: R.always(initialState),
    [GAME.FOOD_EATEN]: R.evolve({
      value: R.add(GROWTH_FACTOR),
      latestIncrement: R.always(moment),
    }),
    [GAME.TICK]: R.evolve({ value: decreaseUntilZero }),
    [GAME.COLLISION]: moment - GROWTH_FACTOR <= state.latestIncrement ?
      R.evolve({ value: R.inc }) : R.identity,
  })(state);
