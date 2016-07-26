import R from 'ramda';
import { createStructuredSelector, createSelector } from 'reselect';

import { MESSAGES } from '../constants';
import {
  getGameDimensions,
  getViewBoxStr,
} from './dimensions';
import { getSnakeKeyPositions } from './snake';
import { getFoodPosition } from './food';

export const getGameStatus = R.prop('gameStatus');

export default createStructuredSelector({
  dimensions: getGameDimensions,
  foodProps: getFoodPosition,
  messagesProps: createSelector([getGameStatus], R.prop(R.__, MESSAGES)),
  snakeProps: createStructuredSelector({
    points: getSnakeKeyPositions,
  }),
  viewboxStr: getViewBoxStr,
});
