import { combineReducers } from 'redux-immutable';

import { TICK } from '../actions';
import enhancers from './enhancers';

import directionsBufferReducer from './directions-buffer';
import getFoodRandomizerReducer from './food-randomizer';
import getGameStatusReducer from './game-status';
import getGrowthBufferReducer from './growth-buffer';
import getSnakeReducer from './snake';

import getPostTickInfo from '../selectors/post-tick-info';

const getBaseReducer =
  (newDirections, newSnake, isFoodEaten, didSnakeCrash) => combineReducers({
    directionsBuffer: newDirections ?
      () => newDirections : directionsBufferReducer,
    foodRandomizer: getFoodRandomizerReducer(isFoodEaten),
    gameStatus: getGameStatusReducer(didSnakeCrash),
    growthBuffer: getGrowthBufferReducer(isFoodEaten),
    snake: newSnake ? () => newSnake : getSnakeReducer(),
  });

const mainReducer = (state, action) => {
  if (action.type !== TICK) return getBaseReducer()(state, action);

  const newDirectionsBuffer =
    directionsBufferReducer(state.get('directionsBuffer'), action);
  const currentDirection = newDirectionsBuffer.first();
  const isGrowing = state.get('growthBuffer') > 0;
  const newSnake =
    getSnakeReducer(currentDirection, isGrowing)(state.get('snake'), action);
  const { didSnakeCrash, isFoodEaten } =
    getPostTickInfo(state.set('snake', newSnake));
  const snake = didSnakeCrash ? state.get('snake') : newSnake;

  return getBaseReducer(
    newDirectionsBuffer, snake, isFoodEaten, didSnakeCrash)(state, action);
};

export default enhancers(mainReducer);
