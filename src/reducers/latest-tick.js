import { GAME } from '../actions';
import getNowInMs from '../utils/get-now-in-ms';

const initialState = null;

export default (state = initialState, { type }) => (
  type === GAME.TICK ? getNowInMs() : state
);
