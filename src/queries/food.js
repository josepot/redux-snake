import R from 'ramda';
import { createSelector } from 'reselect';

import * as foodFunctions from './result-functions/food';
import createSelectorTrackingArguments from '../utils/create-selector-tracking-arguments';
import { getHead, getSnakeKeyPositions } from './snake';

const getFoodGeneratorOffset = R.prop('foodGeneratorOffset');

export const getFoodPosition = createSelectorTrackingArguments([0])(
  [getFoodGeneratorOffset, getSnakeKeyPositions],
  foodFunctions.getFoodPosition
);

export const getIsFoodEaten = createSelector(
  [getFoodPosition, getHead],
  R.equals
);

