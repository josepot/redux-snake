import R from 'ramda';
import { createSelector } from 'reselect';

import * as snakeFunctions from './result-functions/snake';

export const getCurrentMoment = R.prop('currentMoment');
const getDirectionsStack = R.prop('directionsStack');
const getFoodEaten = R.prop('foodEaten');
const getGrowthBuffer = R.path(['growthBuffer', 'current']);

const getBodyLength = createSelector(
  [getFoodEaten, getGrowthBuffer],
  snakeFunctions.getBodyLength
);

// The moment when the head of the snake was in the position of the current tail
const getTailMoment = createSelector(
  [getCurrentMoment, getBodyLength],
  R.subtract
);

const getRelevantDirections = createSelector(
  [getCurrentMoment, getTailMoment, getDirectionsStack],
  snakeFunctions.getRelevantDirections
);

export const getHead = createSelector(
  [getCurrentMoment, getRelevantDirections],
  snakeFunctions.getHead
);

export const getTail = createSelector(
  [getTailMoment, getRelevantDirections],
  snakeFunctions.getTail
);

export const getSnakeKeyPositions = createSelector(
  [getHead, getTail, getRelevantDirections],
  snakeFunctions.getSnakeKeyPositions
);

export const getIsThereCollision = createSelector(
  [getHead, getSnakeKeyPositions],
  R.either(
    snakeFunctions.isHeadOutOfBounds,
    snakeFunctions.didHeadHitBody
  )
);
