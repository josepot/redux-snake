import R from 'ramda';
import { select, take, put } from 'redux-saga/effects';
import { createStructuredSelector } from 'reselect';
import { getCurrentMoment } from '../queries/snake';

import { UI, game } from '../actions';
import { GAME_STATUS, KEYBOARD_DIRECTIONS } from '../constants';

export function* watchNewDirection() {
  while (true) {
    const { payload: { keyCode } } = yield take(
      ({ type, payload }) =>
        type === UI.KEY_PRESSED && KEYBOARD_DIRECTIONS[payload.keyCode]
    );
    const { gameStatus, currentMoment } =
      yield select(createStructuredSelector({
        gameStatus: R.prop('gameStatus'),
        currentMoment: getCurrentMoment,
      }));

    if ([GAME_STATUS.PLAYING, GAME_STATUS.READY].indexOf(gameStatus) > -1) {
      yield put(
        game.onDirectionChanged(
          KEYBOARD_DIRECTIONS[keyCode],
          currentMoment
        )
      );
    }

    if (gameStatus === GAME_STATUS.READY) yield put(game.onTick());
  }
}
