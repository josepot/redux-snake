export const getViewBoxStr =
  ({ x, y, width, height }) => `${x} ${y} ${width} ${height}`;

export const getGameDimensions = (gameProportions, { width, height }) => {
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
