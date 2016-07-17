import R from 'ramda';
import { select, take, put } from 'redux-saga/effects';

import { UI, game } from '../actions';
import { READY, PLAYING } from '../reducers/game-status';
import { KEYBOARD_DIRECTIONS } from '../constants';

export function* watchNewDirection() {
  while (true) {
    const { payload: { keyCode } } = yield take(
      ({ type, payload }) =>
        type === UI.KEY_PRESSED && KEYBOARD_DIRECTIONS[payload.keyCode]
    );
    const { gameStatus, currentMoment } =
      yield select(R.pick(['gameStatus', 'currentMoment']));

    if ([PLAYING, READY].indexOf(gameStatus) > -1) {
      yield put(
        game.onDirectionChanged(
          KEYBOARD_DIRECTIONS[keyCode],
          currentMoment
        )
      );
    }

    if (gameStatus === READY) yield put(game.onTick());
  }
}
