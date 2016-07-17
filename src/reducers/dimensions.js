import { UI } from '../actions';

const initialState = { width: 800, height: 600 };

export default (state = initialState, { type, payload }) => (
  type === UI.WINDOW_RESIZED ? payload : state
);
