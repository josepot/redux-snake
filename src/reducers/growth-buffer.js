import R from 'ramda';
import { GAME } from '../actions';
import { GROWTH_FACTOR } from '../config';

const initialState = 0;

const decreaseUntilZero = R.pipe(R.dec, R.max(0));

const growthBufferReducer = (state = initialState, { type }) =>
  R.propOr(R.identity, type, {
    [GAME.NEW]: R.always(initialState),
    [GAME.FOOD_EATEN]: R.add(GROWTH_FACTOR),
    [GAME.TICK]: decreaseUntilZero,
  })(state);

const undoOnCollisionEnhancer = (reducer) =>
  ({ previous, current } = { previous: null, current: 0 }, { type }) => (
    type === GAME.COLLISION ?
      { previous: null, current: previous } :
      { previous: current, current: reducer(current, { type }) }
  );

export default undoOnCollisionEnhancer(growthBufferReducer);
