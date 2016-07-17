import R from 'ramda';
import { select, take, put } from 'redux-saga/effects';

import { UI, game } from '../actions';
import { SPACE_KEY_CODE } from '../constants';
import { READY, PLAYING } from '../reducers/game-status';
import { initialHead } from '../config';
import getFoodPosition from '../utils/get-food-position';

export function* watchSpaceKey() {
  while (true) {
    yield take(
      ({ type, payload: { keyCode } = {} }) =>
        type === UI.KEY_PRESSED && keyCode === SPACE_KEY_CODE
    );
    const { gameStatus, currentMoment } =
      yield select(R.pick(['gameStatus', 'currentMoment']));

    if (gameStatus === READY && currentMoment > 0) {
      yield put(
        game.onStartNewGame(
          getFoodPosition([initialHead]))
      );
    }

    if (gameStatus === PLAYING) {
      yield put(game.onTick());
    }
  }
}

