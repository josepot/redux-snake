import R from 'ramda';
import { delay, takeEvery } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';

import { TICK_FREQUENCY } from '../config';
import { PLAYING } from '../reducers/game-status';
import getFoodPosition from '../utils/get-food-position';
import {
  getIsFoodEaten,
  getIsThereCollision,
  getSnakePositions,
} from '../queries/snake';

import { GAME, game } from '../actions';

function* handleTick() {
  const currentMoment = yield select(R.prop('currentMoment'));
  const isThereCollision = yield select(getIsThereCollision);
  if (isThereCollision) return yield put(game.onCollision(currentMoment));

  const isFoodEaten = yield select(getIsFoodEaten);
  if (isFoodEaten) {
    const snakePositions = yield select(getSnakePositions);
    yield put(game.onFoodEaten(getFoodPosition(snakePositions), currentMoment));
  }

  yield call(delay, TICK_FREQUENCY);
  const gameStatus = yield select(R.prop('gameStatus'));
  if (gameStatus === PLAYING) yield put(game.onTick());
  return null;
}

export function* watchTick() {
  yield* takeEvery(GAME.TICK, handleTick);
}
