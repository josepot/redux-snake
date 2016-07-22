import R from 'ramda';
import { delay, takeEvery } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';

import getNowInMs from '../utils/get-now-in-ms';
import { GAME_STATUS } from '../constants';
import { TICK_FREQUENCY } from '../config';
import getFoodPosition from '../utils/get-food-position';
import {
  getCurrentMoment,
  getIsFoodEaten,
  getIsThereCollision,
  getSnakeKeyPositions,
} from '../queries/snake';

import { GAME, game } from '../actions';

function* handleTick() {
  const isThereCollision = yield select(getIsThereCollision);
  if (isThereCollision) return yield put(game.onCollision());

  const currentMoment = yield select(getCurrentMoment);
  const isFoodEaten = yield select(getIsFoodEaten);
  if (isFoodEaten) {
    const snakeKeyPositions = yield select(getSnakeKeyPositions);
    yield put(
      game.onFoodEaten(getFoodPosition(snakeKeyPositions), currentMoment)
    );
  }

  const latestTick = yield select(R.prop('latestTick'));
  const msToWait = TICK_FREQUENCY - (getNowInMs() - latestTick);

  if (msToWait > 0) yield call(delay, msToWait);
  const gameStatus = yield select(R.prop('gameStatus'));
  if (gameStatus === GAME_STATUS.PLAYING) yield put(game.onTick());
  return null;
}

export function* watchTick() {
  yield* takeEvery(GAME.TICK, handleTick);
}
