import { Stack } from 'immutable';
import { NEW_GAME, NEW_DIRECTION } from '../actions.js';
import { initialHead } from '../config.js';
import evolvePosition from '../evolve-position.js';

export const { UP, DOWN, RIGHT, LEFT } = {
  UP: 'UP',
  DOWN: 'DOWN',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
};
export const OPPOSITE_DIRECTIONS = {
  LEFT: RIGHT, RIGHT: LEFT, UP: DOWN, DOWN: UP,
};

const initialState = new Stack();

const isNewDirectionInValid = (newDirection, latestDirection) => [
  latestDirection, OPPOSITE_DIRECTIONS[latestDirection],
].includes(newDirection);

export default function directionsStack(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME:
      return initialState;
    case NEW_DIRECTION: {
      const { direction, moment } = action;
      const latest = state.first();

      if (!latest) return Stack.of({ direction, moment, head: initialHead });
      if (isNewDirectionInValid(direction, latest.direction)) return state;

      const nextMoment = moment > latest.moment ? moment : latest.moment + 1;
      const nextHead = evolvePosition(
        latest.head, latest.direction, nextMoment - latest.moment
      );

      return state.push({ direction, moment: nextMoment, head: nextHead });
    }
    default:
      return state;
  }
}
