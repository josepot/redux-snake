import { NEW_GAME } from '../actions';

const initialState = null;

export default isFoodEaten => (state = initialState, { type, payload }) => {
  if (isFoodEaten) return state + 1;
  if (type === NEW_GAME) return payload.randomSeed;
  return state;
};
