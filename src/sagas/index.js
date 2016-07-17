// import R from 'ramda';
import { fork, put } from 'redux-saga/effects';

import * as newDirection from './new-direction';
import * as spaceKeyPress from './space-key-press';
import * as tick from './tick';
import { game } from '../actions';
import { initialHead } from '../config';
import getFoodPosition from '../utils/get-food-position';

// const forkAllSagas = R.pipe(R.map(R.values), R.map(fork));

export default function* root() {
  yield put(
    game.onStartNewGame(
      getFoodPosition([initialHead]))
  );
  yield fork(newDirection.watchNewDirection);
  yield fork(spaceKeyPress.watchSpaceKey);
  yield fork(tick.watchTick);
//  yield forkAllSagas([
//    newDirection,
//    spaceKeyPress,
//    tick,
//  ]);
}
