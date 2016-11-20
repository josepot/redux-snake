import dimensionsReducer from '../dimensions';

export default reducer => (state, action) =>
  reducer(state.delete('dimensions'), action)
  .set('dimensions', dimensionsReducer(state.get('dimensions'), action));
