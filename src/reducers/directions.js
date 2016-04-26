import { List } from 'immutable';
import { NEW_GAME, NEW_DIRECTION } from '../actions';

export const { UP, DOWN, RIGHT, LEFT } = {
  UP: 'UP',
  DOWN: 'DOWN',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
};
export const OPPOSITE_DIRECTIONS = {
  LEFT: RIGHT, RIGHT: LEFT, UP: DOWN, DOWN: UP,
};

const initialState = new List();

export default function directions(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case NEW_DIRECTION: {
      const { direction, tick } = action;

      const latestDir = state.first() && state.first().direction;
      const latestTick = (state.first() && state.first().tick) || -1;
      const nextTick = tick > latestTick ? tick : latestTick + 1;

      // If the new direction is the same as the latest direction
      // or the opposite of the previous direction then we don't want
      // to add it to the List. I.e: if the snake is going left and the user
      // hits the right arrow then we don't want to have that under consideration
      return [latestDir, OPPOSITE_DIRECTIONS[latestDir]].includes(direction) ?
        state :
        state.unshift({ direction, tick: nextTick });
    }
    default:
      return state;
  }
}
