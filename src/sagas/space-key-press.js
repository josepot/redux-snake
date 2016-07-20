import R from 'ramda';
import { select, take, put } from 'redux-saga/effects';
import { createStructuredSelector } from 'reselect';
import { List } from 'immutable';

import { getCurrentMoment } from '../queries/snake';
import { UI, game } from '../actions';
import { GAME_STATUS, SPACE_KEY_CODE } from '../constants';
import { initialHead } from '../config';
import getFoodPosition from '../utils/get-food-position';

export function* watchSpaceKey() {
  while (true) {
    yield take(
      ({ type, payload: { keyCode } = {} }) =>
        type === UI.KEY_PRESSED && keyCode === SPACE_KEY_CODE
    );
    const { gameStatus, currentMoment } =
      yield select(createStructuredSelector({
        gameStatus: R.prop('gameStatus'),
        currentMoment: getCurrentMoment,
      }));

    if (gameStatus === GAME_STATUS.READY && currentMoment > 0) {
      yield put(
        game.onStartNewGame(
          getFoodPosition(List.of(initialHead))
        )
      );
    }

    if (gameStatus === GAME_STATUS.PLAYING) {
      yield put(game.onTick());
    }
  }
}

