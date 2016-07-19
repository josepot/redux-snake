import R from 'ramda';
import { createStructuredSelector, createSelector } from 'reselect';

import { MESSAGES } from '../constants';
import {
  getGameDimensions,
  getMargins,
  getMessagesPosition,
  getViewBoxStr,
} from './dimensions';
import { getSnakeKeyPositions, getFoodPosition } from './snake';

export const getGameStatus = R.prop('gameStatus');

export default createStructuredSelector({
  dimensions: getGameDimensions,
  foodProps: getFoodPosition,
  marginProps: getMargins,
  messagesProps: createSelector(
    [getGameStatus, getMessagesPosition],
    (gameStatus, position) => ({
      ...MESSAGES[gameStatus],
      position,
    })
  ),
  snakeProps: createStructuredSelector({
    points: createSelector(getSnakeKeyPositions, s => s.toArray()),
  }),
  viewboxStr: getViewBoxStr,
});
