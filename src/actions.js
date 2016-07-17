// Helper functions
function createTypes(base, types) {
  const res = {};
  types.forEach(type => { res[type] = `app/${base}/${type}`; });
  return res;
}

const action = (type, payload = {}) => ({ type, payload });

// Action Types
export const UI = createTypes('UI', [
  'KEY_PRESSED', 'WINDOW_RESIZED',
]);

export const GAME = createTypes('GAME', [
  'COLLISION', 'DIRECTION_CHANGED', 'FOOD_EATEN', 'NEW', 'TICK',
]);

// Action Creators
export const ui = {
  onKeyPressed: keyCode => action(UI.KEY_PRESSED, { keyCode }),
  onWindowResized:
    (width, height) => action(UI.WINDOW_RESIZED, { width, height }),
};

export const game = {
  onCollision: (moment) => action(GAME.COLLISION, { moment }),
  onDirectionChanged: (direction, moment) =>
    action(GAME.DIRECTION_CHANGED, { direction, moment }),
  onFoodEaten: (foodPosition, moment) =>
    action(GAME.FOOD_EATEN, { foodPosition, moment }),
  onStartNewGame: foodPosition => action(GAME.NEW, { foodPosition }),
  onTick: () => action(GAME.TICK),
};
