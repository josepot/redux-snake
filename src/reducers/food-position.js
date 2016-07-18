import { GAME } from '../actions';
const initialState = null;

export default (state = initialState, { type, payload }) => (
  [GAME.NEW, GAME.FOOD_EATEN].includes(type) ?
    payload.foodPosition :
    state
);
