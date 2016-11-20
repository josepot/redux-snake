import R from 'ramda';
import { createStructuredSelector, createSelector } from 'reselect';

import { MESSAGES } from '../constants';
import {
  getGameDimensions,
  getViewBoxStr,
} from './dimensions';
import getSnakeKeyPositions from './snake-key-points';
import getFoodPosition from './food-position';
import { getGameStatus } from './raw-selectors';

export default createStructuredSelector({
  dimensions: getGameDimensions,
  foodProps: getFoodPosition,
  messagesProps: createSelector([getGameStatus], R.prop(R.__, MESSAGES)),
  snakeProps: createStructuredSelector({
    keyPoints: getSnakeKeyPositions,
  }),
  viewboxStr: getViewBoxStr,
});
