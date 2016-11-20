import { NEW_GAME } from '../../actions';

export default reducer => (state, action) => {
  const newState = action.type === NEW_GAME ? undefined : state;
  return reducer(newState, action);
};
