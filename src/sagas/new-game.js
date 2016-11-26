import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { getGameStatus } from '../selectors/raw-selectors';
import { SPACE_KEY_PRESSED, onStartNewGame } from '../actions';
import { GAME_STATUS } from '../constants';

function* startNewGameWhenReady() {
  const gameStatus = yield select(getGameStatus);
  if (gameStatus !== GAME_STATUS.READY) return;

  const randomSeed = Math.round(Math.random() * 1000);
  const randomIncreasser = 1 + Math.round(Math.random() * 10);
  yield put(onStartNewGame(randomSeed, randomIncreasser));
}

export default function* () {
  yield call(startNewGameWhenReady);
  yield* takeEvery(SPACE_KEY_PRESSED, startNewGameWhenReady);
}
