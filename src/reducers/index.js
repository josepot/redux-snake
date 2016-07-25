import { combineReducers } from 'redux';

import currentMoment from './current-moment';
import dimensions from './dimensions';
import directionsStack from './directions-stack';
import foodEaten from './food-eaten';
import gameStatus from './game-status';
import growthBuffer from './growth-buffer';
import foodGeneratorOffset from './food-generator-offset';
import latestTick from './latest-tick';

export default combineReducers({
  currentMoment,
  dimensions,
  directionsStack,
  foodEaten,
  gameStatus,
  growthBuffer,
  foodGeneratorOffset,
  latestTick,
});
