import { takeEvery } from 'redux-saga';
import { put, cancelled } from 'redux-saga/effects';

export default function* (channel) {
  try {
    yield* takeEvery(channel, put);
  } finally {
    if (yield cancelled) channel.close();
  }
}
