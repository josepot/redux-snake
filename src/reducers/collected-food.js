import { List } from 'immutable';
import { NEW_GAME, FOOD_EATEN } from '../actions.js';

const initialState = new List();
export default function eatenFood(state = initialState, action) {
  const { tick, buffer } = action;
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case FOOD_EATEN:
      return state.push({ tick, buffer });
    default:
      return state;
  }
}
