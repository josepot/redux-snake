import { NEW_GAME, PAUSE, RESUME, NEW_DIRECTION, COLLISION } from '../actions';

export const READY = 'READY';
export const PLAYING = 'PLAYING';
export const PAUSED = 'PAUSED';
export const ENDED = 'ENDED';

const initialStatus = READY;

export default function gameStatus(state = initialStatus, action) {
  switch (action.type) {
    case NEW_GAME: return READY;
    case PAUSE: return PAUSED;
    case RESUME: return PLAYING;
    case NEW_DIRECTION: return state === READY ? PLAYING : state;
    case COLLISION: return ENDED;
    default: return state;
  }
}
