import R from 'ramda';
import { fromJS } from 'immutable';

import { NEW_GAME } from '../actions';

const initialState = fromJS({
  randomSeed: 0,
  randomIncreasser: 0,
});

export default isFoodEaten => (state = initialState, { type, payload }) => {
  if (isFoodEaten) {
    return state.update('randomSeed', R.add(state.get('randomIncreasser')));
  }
  if (type === NEW_GAME) return fromJS(payload);
  return state;
};
