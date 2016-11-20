import { call, cancel, fork, select, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { TICK_FREQUENCY } from '../config';
import { GAME_STATUS } from '../constants';
import { DIRECTION_ENTERED, SPACE_KEY_PRESSED, TICK, onTick } from '../actions';
import { getGameStatus } from '../selectors/raw-selectors';
import dispatchActionsFromChannel from './helpers/dispatch-actions-from-channel';

function* startTicker() {
  const timeChannel = eventChannel(emmit => {
    const tick = () => emmit(onTick());
    window.setTimeout(tick, 0);
    const id = window.setInterval(tick, TICK_FREQUENCY);
    return () => window.clearInterval(id);
  });

  yield call(dispatchActionsFromChannel, timeChannel);
}

export default function* time() {
  let tickerTask;
  while (true) {
    yield take([SPACE_KEY_PRESSED, DIRECTION_ENTERED, TICK]);
    const gameStatus = yield select(getGameStatus);

    if (gameStatus === GAME_STATUS.PLAYING) {
      if (!tickerTask || !tickerTask.isRunning()) {
        tickerTask = yield fork(startTicker);
      }
    } else if (tickerTask && tickerTask.isRunning()) {
      yield cancel(tickerTask);
    }
  }
}
