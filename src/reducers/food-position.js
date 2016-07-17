import { GAME } from '../actions';
const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GAME.NEW:
    case GAME.FOOD_EATEN:
      return payload.foodPosition;
    default:
      return state;
  }
};
