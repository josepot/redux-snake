import { GAME, UI } from '../actions';
import { SPACE_KEY_CODE } from '../constants';

export const READY = 'READY';
export const PLAYING = 'PLAYING';
export const PAUSED = 'PAUSED';
export const ENDED = 'ENDED';

export default (state = READY, { type, payload }) => {
  switch (type) {
    case UI.KEY_PRESSED:
      return payload.keyCode === SPACE_KEY_CODE && {
        [PLAYING]: PAUSED,
        [PAUSED]: PLAYING,
        [ENDED]: READY,
      }[state] || state;
    case GAME.DIRECTION_CHANGED:
      return state === READY ? PLAYING : state;
    case GAME.COLLISION:
      return ENDED;
    default:
      return state;
  }
};
