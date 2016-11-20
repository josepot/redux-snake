import R from 'ramda';
import { SPACE_KEY_PRESSED, DIRECTION_ENTERED } from '../actions';
import { GAME_STATUS } from '../constants';

const gameStatusReducer = (state = GAME_STATUS.READY, { type }) => {
  switch (type) {
    case SPACE_KEY_PRESSED:
      return {
        [GAME_STATUS.PLAYING]: GAME_STATUS.PAUSED,
        [GAME_STATUS.PAUSED]: GAME_STATUS.PLAYING,
        [GAME_STATUS.ENDED]: GAME_STATUS.READY,
      }[state] || state;
    case DIRECTION_ENTERED:
      return state === GAME_STATUS.READY ?
        GAME_STATUS.PLAYING :
        state;
    default:
      return state;
  }
};

export default didSnakeCrash => (
  didSnakeCrash ? R.always(GAME_STATUS.ENDED) : gameStatusReducer
);
