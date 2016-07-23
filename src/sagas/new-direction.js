import R from 'ramda';
import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createStructuredSelector } from 'reselect';
import { getCurrentMoment } from '../queries/snake';

import { UI, game } from '../actions';
import { GAME_STATUS, KEYBOARD_DIRECTIONS } from '../constants';

function* handleNewDirection({ payload: { keyCode } }) {
  const { gameStatus, currentMoment } =
    yield select(createStructuredSelector({
      gameStatus: R.prop('gameStatus'),
      currentMoment: getCurrentMoment,
    }));

  if ([GAME_STATUS.PLAYING, GAME_STATUS.READY].includes(gameStatus)) {
    yield put(
      game.onDirectionChanged(KEYBOARD_DIRECTIONS[keyCode], currentMoment)
    );
    if (gameStatus === GAME_STATUS.READY) yield put(game.onTick());
  }
}

export function* watchNewDirection() {
  yield* takeEvery(({ type, payload }) =>
    type === UI.KEY_PRESSED && KEYBOARD_DIRECTIONS[payload.keyCode],
    handleNewDirection
  );
}
