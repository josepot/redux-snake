import { combineReducers } from 'redux';
import dimensions from './dimensions.js';
import directionsStack from './directions-stack.js';
import foodEaten from './food-eaten.js';
import foodPosition from './food-position.js';
import gameStatus from './game-status.js';
import growthBuffer from './growth-buffer.js';
import currentMoment from './current-moment.js';

export default combineReducers({
  dimensions, directionsStack, foodEaten, foodPosition,
  gameStatus, growthBuffer, currentMoment,
});
