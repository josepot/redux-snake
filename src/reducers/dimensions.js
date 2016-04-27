import R from 'ramda';
import { RESIZE } from '../actions.js';

const initialState = { width: 800, height: 600 };

export default function dimensions(state = initialState, action) {
  return action.type === RESIZE ? R.pick(['width', 'height'], action) : state;
}
