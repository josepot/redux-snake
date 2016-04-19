import { RESIZE } from '../actions';

const initialState = { width: 800, height: 600 };

export default function dimensions(state = initialState, action) {
  const { width, height } = action;
  switch (action.type) {
    case RESIZE:
      return { width, height };
    default:
      return state;
  }
}
