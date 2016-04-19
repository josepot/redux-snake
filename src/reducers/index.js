import { combineReducers } from 'redux';
import dimensions from './dimensions.js';
import directions from './directions.js';
import food from './food.js';
import gameStatus from './game-status.js';
import head from './head.js';
import snakeLength from './snake-length.js';
import tickNumber from './tick-number.js';

export default combineReducers({
  dimensions,
  directions,
  food,
  gameStatus,
  head,
  snakeLength,
  tickNumber,
});
