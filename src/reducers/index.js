import { combineReducers } from 'redux';
import dimensions from './dimensions';
import directionsStack from './directions-stack';
import foodEaten from './food-eaten';
import foodPosition from './food-position';
import gameStatus from './game-status';
import growthBuffer from './growth-buffer';
import currentMoment from './current-moment';

export default combineReducers({
  dimensions,
  directionsStack,
  foodEaten,
  foodPosition,
  gameStatus,
  growthBuffer,
  currentMoment,
});
