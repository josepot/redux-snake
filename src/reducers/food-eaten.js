import R from 'ramda';
import { GAME } from '../actions';

const initialState = 0;

export default (state = initialState, { type }) => R.propOr(R.identity, type, {
  [GAME.NEW]: R.always(initialState),
  [GAME.FOOD_EATEN]: R.inc,
})(state);
