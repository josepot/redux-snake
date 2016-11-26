import { call, race, select, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { TICK_FREQUENCY } from '../config';
import { GAME_STATUS } from '../constants';
import { DIRECTION_ENTERED, SPACE_KEY_PRESSED, TICK, onTick } from '../actions';
import { getGameStatus } from '../selectors/raw-selectors';
import dispatchActionsFromChannel from './helpers/dispatch-actions-from-channel';

function* waitUntilGamesStatusEquals(...gameStatusTargets) {
  do {
    yield take([SPACE_KEY_PRESSED, DIRECTION_ENTERED, TICK]);
  } while (!gameStatusTargets.includes(yield select(getGameStatus)));
}

function* startTicker() {
  yield call(waitUntilGamesStatusEquals, GAME_STATUS.PLAYING);

  const timeChannel = eventChannel(emmit => {
    const tick = () => emmit(onTick());
    window.setTimeout(tick, 0);
    const id = window.setInterval(tick, TICK_FREQUENCY);
    return () => window.clearInterval(id);
  });

  yield call(dispatchActionsFromChannel, timeChannel);
}

export default function* time() {
  while (1) {
    yield race({
      startTicker: call(startTicker),
      stopTicker: call(
        waitUntilGamesStatusEquals, GAME_STATUS.PAUSED, GAME_STATUS.ENDED),
    });
  }
}
