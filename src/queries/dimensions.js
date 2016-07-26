import R from 'ramda';
import { createSelector } from 'reselect';

import { ROWS, COLS, MARGIN } from '../config.js';
import * as dimensionsFunctions from './result-functions/dimensions';

const getDimensions = R.prop('dimensions');

const getViewBox = R.once(R.always({
  x: 0 - MARGIN.LEFT,
  y: 0 - MARGIN.TOP,
  width: COLS + MARGIN.LEFT + MARGIN.RIGHT,
  height: ROWS + MARGIN.TOP + MARGIN.BOTTOM,
}));

const getGameProportions = R.once(() => {
  const width = (COLS + MARGIN.LEFT + MARGIN.RIGHT);
  const height = (ROWS + MARGIN.TOP + MARGIN.BOTTOM);
  return width / height;
});

export const getViewBoxStr = createSelector(
  [getViewBox],
  dimensionsFunctions.getViewBoxStr
);

export const getGameDimensions = createSelector(
  [getGameProportions, getDimensions],
  dimensionsFunctions.getGameDimensions
);
