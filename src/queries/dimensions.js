import R from 'ramda';
import { ROWS, COLS, MARGIN } from '../config.js';
import { createSelector, createStructuredSelector } from 'reselect';

const getViewBox = R.once(R.always({
  x: 0 - MARGIN.LEFT - 0.5,
  y: 0 - MARGIN.TOP - 0.5,
  width: COLS + MARGIN.LEFT + MARGIN.RIGHT,
  height: ROWS + MARGIN.TOP + MARGIN.BOTTOM,
}));

export const getViewBoxStr = createSelector(
  getViewBox,
  ({ x, y, width, height }) => `${x} ${y} ${width} ${height}`
);

const getHorizontalMargins = createSelector(
  getViewBox,
  ({ x, y, width }) => ({
    xStart: x,
    xEnd: x + width,
    top: {
      y: y + (0.5 * MARGIN.TOP),
      width: MARGIN.TOP,
    },
    bottom: {
      y: ROWS + ((MARGIN.BOTTOM - 1) * 0.5),
      width: MARGIN.BOTTOM,
    },
  })
);

const getVerticalMargins = createSelector(
  getViewBox,
  ({ x, y, height }) => ({
    yStart: y,
    yEnd: y + height,
    left: {
      x: x + (0.5 * MARGIN.LEFT),
      width: MARGIN.LEFT,
    },
    right: {
      x: COLS + ((MARGIN.RIGHT - 1) * 0.5),
      width: MARGIN.RIGHT,
    },
  })
);

export const getMargins = createStructuredSelector({
  horizontal: getHorizontalMargins,
  vertical: getVerticalMargins,
});

const getGameProportions = R.once(() => {
  const width = (COLS + MARGIN.LEFT + MARGIN.RIGHT);
  const height = (ROWS + MARGIN.TOP + MARGIN.BOTTOM);
  return width / height;
});

const getDimensions = R.path(['dimensions']);

export const getGameDimensions = createSelector(
  getGameProportions,
  getDimensions,
  (gameProportions, { width, height }) => {
    const windowProportions = width / height;

    return windowProportions > gameProportions ?
    {
      width: height * gameProportions,
      height,
    } : {
      width,
      height: width / gameProportions,
    };
  }
);

export const getMessagesPosition = R.once(() => ({
  x: COLS / 2,
  y: ROWS + (MARGIN.BOTTOM / 3.5),
}));
