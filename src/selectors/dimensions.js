import R from 'ramda';
import { createSelector } from 'reselect';

import { ROWS, COLS, MARGIN } from '../config.js';
import { getDimensions } from './raw-selectors';

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

export const gameDimensionsCombiner = (gameProportions, { width, height }) => {
  const windowProportions = width / height;

  return windowProportions > gameProportions ?
  {
    width: height * gameProportions,
    height,
  } : {
    width,
    height: width / gameProportions,
  };
};

export const getViewBoxStr = createSelector(
  [getViewBox],
  ({ x, y, width, height }) => `${x} ${y} ${width} ${height}`
);

export const getGameDimensions = createSelector(
  [getGameProportions, getDimensions],
  gameDimensionsCombiner
);
