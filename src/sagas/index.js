import { fork } from 'redux-saga/effects';

import dimensions from './dimensions';
import newGame from './new-game';
import keyboard from './keyboard';
import time from './time';

export default function* root() {
  yield fork(dimensions);
  yield fork(keyboard);
  yield fork(newGame);
  yield fork(time);
}
