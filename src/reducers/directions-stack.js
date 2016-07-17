import { Stack } from 'immutable';
import { GAME } from '../actions';
import { initialHead } from '../config';
import evolvePosition from '../utils/evolve-position';
import { OPPOSITE_DIRECTIONS } from '../constants';

const initialState = new Stack();

const isNewDirectionInValid = (newDirection, latestDirection) => [
  latestDirection, OPPOSITE_DIRECTIONS[latestDirection],
].includes(newDirection);

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GAME.NEW:
      return initialState;
    case GAME.DIRECTION_CHANGED: {
      const { direction } = payload;
      let { moment } = payload;
      const latest = state.first();

      if (!latest) return Stack.of({ direction, moment, position: initialHead });
      if (isNewDirectionInValid(direction, latest.direction)) return state;

      moment = moment > latest.moment ? moment : latest.moment + 1;
      const position = evolvePosition(
        latest.position, latest.direction, moment - latest.moment
      );

      return state.push({ direction, moment, position });
    }
    default:
      return state;
  }
};
