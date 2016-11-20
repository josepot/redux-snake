import { List } from 'immutable';
import { DIRECTION_ENTERED, TICK } from '../actions';
import { OPPOSITE_DIRECTIONS } from '../constants';

const initialState = new List();

const isNewDirectionValid = (oldD, newD) =>
  oldD !== newD && newD !== OPPOSITE_DIRECTIONS[oldD];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case DIRECTION_ENTERED: {
      const newDirection = payload.directionType;
      return isNewDirectionValid(state.last(), newDirection) ?
        state.push(payload.directionType) :
        state;
    }
    case TICK:
      return state.size > 1 ?
        state.shift() :
        state;
    default:
      return state;
  }
};
