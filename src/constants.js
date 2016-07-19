export const KEYBOARD_DIRECTIONS = {
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
};
export const SPACE_KEY_CODE = 32;

export const { UP, DOWN, RIGHT, LEFT } = {
  UP: 'UP',
  DOWN: 'DOWN',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
};

export const OPPOSITE_DIRECTIONS = {
  LEFT: RIGHT, RIGHT: LEFT, UP: DOWN, DOWN: UP,
};

export const GAME_STATUS = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
};

export const MESSAGES = {
  [GAME_STATUS.READY]: {
    main: 'READY TO START',
    sub: 'Press an arrow key to start moving',
  },
  [GAME_STATUS.PAUSED]: {
    main: 'PAUSED',
    sub: 'Press the space key to resume the game',
  },
  [GAME_STATUS.ENDED]: {
    main: 'GAME OVER',
    sub: 'Press the space key to start a new game',
  },
};
