import { NEW_GAME, FOOD_EATEN } from '../actions.js';

const initialState = 0;

export default function food(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case FOOD_EATEN:
      return state + 1;
    default:
      return state;
  }
}
