import R from 'ramda';
import { List } from 'immutable';
import { TICK } from '../actions';
import { initialHead } from '../config';
import { UP, DOWN, RIGHT, LEFT } from '../constants';

const initialState = List.of(initialHead);

const transformations = {
  [DOWN]: { y: R.inc },
  [UP]: { y: R.dec },
  [RIGHT]: { x: R.inc },
  [LEFT]: { x: R.dec },
};

const getNextHead = (direction, currentHead) =>
  R.evolve(transformations[direction], currentHead);

export default (currentDirection, isGrowing) =>
  (state = initialState, { type }) => {
    if (type !== TICK) return state;

    const currentHead = state.first();
    const nextHead = getNextHead(currentDirection, currentHead);

    const result = state.unshift(nextHead);
    return isGrowing ? result : result.pop();
  };
