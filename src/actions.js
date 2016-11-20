export const TICK = 'TICK';
export const DIRECTION_ENTERED = 'DIRECTION_ENTERED';
export const SPACE_KEY_PRESSED = 'SPACE_KEY_PRESSED';
export const WINDOW_RESIZED = 'WINDOW_RESIZED';
export const NEW_GAME = 'NEW_GAME';

const action = (type, payload = {}) => ({ type, payload });

// Action Creators
export const onTick = () => action(TICK);
export const onDirectionEntered =
  directionType => action(DIRECTION_ENTERED, { directionType });
export const onSpaceKeyPressed = () => action(SPACE_KEY_PRESSED);
export const onWindowResized =
  (width, height) => action(WINDOW_RESIZED, { width, height });

export const onStartNewGame = (randomSeed, randomIncreasser) =>
  action(NEW_GAME, { randomSeed, randomIncreasser });
