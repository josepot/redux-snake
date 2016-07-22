import { GAME } from '../actions';
import getNowInMs from '../utils/get-now-in-ms';

const initialState = getNowInMs();

export default (state = initialState, { type }) => (
  type === GAME.TICK ? getNowInMs() : state
);
