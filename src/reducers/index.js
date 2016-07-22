import { combineReducers } from 'redux';

import currentMoment from './current-moment';
import dimensions from './dimensions';
import directionsStack from './directions-stack';
import foodEaten from './food-eaten';
import foodPosition from './food-position';
import gameStatus from './game-status';
import growthBuffer from './growth-buffer';
import latestTick from './latest-tick';

export default combineReducers({
  currentMoment,
  dimensions,
  directionsStack,
  foodEaten,
  foodPosition,
  gameStatus,
  growthBuffer,
  latestTick,
});
