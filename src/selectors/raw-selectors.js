const get = (...path) => state => state.getIn(path);

export const getDimensions = get('dimensions');
export const getDirectionsBuffer = get('directionsBuffer');
export const getFoodRandomizer = get('foodRandomizer', 'randomSeed');
export const getGameStatus = get('gameStatus');
export const growthBuffer = get('growthBuffer');
export const getSnake = get('snake');
