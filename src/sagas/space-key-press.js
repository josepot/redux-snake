import R from 'ramda';
import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createStructuredSelector } from 'reselect';

import { getCurrentMoment } from '../queries/snake';
import { UI, game } from '../actions';
import { GAME_STATUS, SPACE_KEY_CODE } from '../constants';

function* handleSpaceKey() {
  const { gameStatus, currentMoment } = yield select(createStructuredSelector({
    gameStatus: R.prop('gameStatus'),
    currentMoment: getCurrentMoment,
  }));

  if (gameStatus === GAME_STATUS.READY && currentMoment > 0) {
    yield put(game.onStartNewGame());
  } else if (gameStatus === GAME_STATUS.PLAYING) {
    yield put(game.onTick());
  }
}

export function* watchSpaceKey() {
  yield* takeEvery(
    ({ type, payload: { keyCode } = {} }) =>
      type === UI.KEY_PRESSED && keyCode === SPACE_KEY_CODE,
      handleSpaceKey
  );
}
