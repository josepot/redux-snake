import { take, call, put, select } from 'redux-saga/effects';
import { getGameStatus } from '../selectors/raw-selectors';
import { SPACE_KEY_PRESSED, onStartNewGame } from '../actions';
import { GAME_STATUS } from '../constants';

function* startNewGame() {
  const randomSeed = Math.floor(Math.random() * 1000);
  const randomIncreasser = Math.floor(Math.random() * 10);
  yield put(onStartNewGame(randomSeed, randomIncreasser));
}

export default function* () {
  yield call(startNewGame);

  while (1) {
    yield take(SPACE_KEY_PRESSED);
    const gameStatus = yield select(getGameStatus);
    if (gameStatus === GAME_STATUS.READY) {
      yield call(startNewGame);
    }
  }
}
