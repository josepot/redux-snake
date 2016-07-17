import { createStructuredSelector, createSelector } from 'reselect';

import { getGameDimensions, getMargins, getViewBoxStr } from './dimensions';
import { getSnakeKeyPositions, getFoodPosition } from './snake';

export default createStructuredSelector({
  dimensions: getGameDimensions,
  foodProps: getFoodPosition,
  marginProps: getMargins,
  snakeProps: createStructuredSelector({
    points: createSelector(getSnakeKeyPositions, s => s.toArray()),
  }),
  viewboxStr: getViewBoxStr,
});
