import { combineReducers } from 'redux';
import dimensions from './dimensions.js';
import directions from './directions.js';
import food from './food.js';
import gameStatus from './game-status.js';
import collectedFood from './collected-food.js';
import tickNumber from './tick-number.js';

export default combineReducers({
  dimensions, directions, food, gameStatus, collectedFood, tickNumber,
});
