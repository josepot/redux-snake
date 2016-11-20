const get = prop => state => state.get(prop);

export const getDimensions = get('dimensions');
export const getDirectionsBuffer = get('directionsBuffer');
export const getFoodRandomizer = get('foodRandomizer');
export const getGameStatus = get('gameStatus');
export const growthBuffer = get('growthBuffer');
export const getSnake = get('snake');
