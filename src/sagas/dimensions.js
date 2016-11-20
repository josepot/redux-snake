import { eventChannel } from 'redux-saga';

import dispatchActionsFromChannel from './helpers/dispatch-actions-from-channel';
import { onWindowResized } from '../actions';

export default function* dimensions() {
  const dimensionsChannel = eventChannel(emit => {
    const onDimensionsUpdated = () =>
      emit(onWindowResized(window.innerWidth, window.innerHeight));
    window.setTimeout(onDimensionsUpdated, 0);
    return window.addEventListener('resize', onDimensionsUpdated);
  });

  yield* dispatchActionsFromChannel(dimensionsChannel);
}

