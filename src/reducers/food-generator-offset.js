import R from 'ramda';
import { GAME } from '../actions';

export const initialState = 0;

export default (state = initialState, { type, payload }) => R.propOr(R.identity, type, {
  [GAME.INIT]: () => payload.foodGeneratorSeed,
  [GAME.FOOD_EATEN]: R.inc,
  [GAME.NEW]: R.inc,
})(state);
