import { GAME, UI } from '../actions';
import { SPACE_KEY_CODE, GAME_STATUS } from '../constants';

export default (state = GAME_STATUS.READY, { type, payload }) => {
  switch (type) {
    case UI.KEY_PRESSED:
      return payload.keyCode === SPACE_KEY_CODE && {
        [GAME_STATUS.PLAYING]: GAME_STATUS.PAUSED,
        [GAME_STATUS.PAUSED]: GAME_STATUS.PLAYING,
        [GAME_STATUS.ENDED]: GAME_STATUS.READY,
      }[state] || state;
    case GAME.DIRECTION_CHANGED:
      return state === GAME_STATUS.READY ? GAME_STATUS.PLAYING : state;
    case GAME.COLLISION:
      return GAME_STATUS.ENDED;
    default:
      return state;
  }
};
