import { take, put, cancelled } from 'redux-saga/effects';

export default function* (channel) {
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    if (yield cancelled) channel.close();
  }
}
