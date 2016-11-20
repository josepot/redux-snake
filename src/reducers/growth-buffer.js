import R from 'ramda';
import { TICK } from '../actions';
import { GROWTH_FACTOR } from '../config';

const initialState = 0;

const decreaseUntilZero = R.compose(R.max(0), R.dec);

export default isFoodEaten => (state = initialState, { type }) => {
  if (type !== TICK) return state;

  return R.pipe(
    decreaseUntilZero,
    R.when(() => isFoodEaten, R.add(GROWTH_FACTOR))
  )(state);
};
