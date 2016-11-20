import { eventChannel } from 'redux-saga';
import { SPACE_KEY_CODE, KEYBOARD_DIRECTIONS } from '../constants';
import { onDirectionEntered, onSpaceKeyPressed } from '../actions';
import dispatchActionsFromChannel from './helpers/dispatch-actions-from-channel';

export default function* keyboard() {
  const keyboardChannel = eventChannel(emit => {
    const onKeyPressed = ({ keyCode, which }) => {
      const key = keyCode || which;
      if (key === SPACE_KEY_CODE) return emit(onSpaceKeyPressed());

      const direction = KEYBOARD_DIRECTIONS[key];
      return direction ?
        emit(onDirectionEntered(direction)) :
        null;
    };
    return document.addEventListener('keydown', onKeyPressed, true);
  });

  yield* dispatchActionsFromChannel(keyboardChannel);
}

