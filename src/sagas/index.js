import R from 'ramda';
import { fork, put } from 'redux-saga/effects';

import * as newDirection from './new-direction';
import * as spaceKeyPress from './space-key-press';
import * as tick from './tick';
import { game } from '../actions';
import { MAXIMUM_INITIAL_OFFSET } from '../config';

const forkAllSagas = R.pipe(
  R.map(R.values), R.flatten, R.filter(R.is(Function)), R.map(fork)
);

const getFoodGeneratorSeed = R.compose(
  Math.round, R.multiply(MAXIMUM_INITIAL_OFFSET), Math.random
);

export default function* root() {
  yield put(game.onInit(getFoodGeneratorSeed()));

  yield forkAllSagas([
    newDirection,
    spaceKeyPress,
    tick,
  ]);
}
