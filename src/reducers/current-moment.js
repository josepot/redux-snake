import R from 'ramda';
import { GAME } from '../actions';

export const initialState = 0;

export default (state = initialState, { type }) => R.propOr(R.identity, type, {
  [GAME.NEW]: R.always(initialState),
  [GAME.TICK]: R.inc,
  [GAME.COLLISION]: R.dec,
})(state);
