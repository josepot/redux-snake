import { expect } from 'chai';

import { SPACE_KEY_CODE, GAME_STATUS } from '../../src/constants';
import { game, ui } from '../../src/actions';
import reducer from '../../src/reducers/game-status';

const initialState = reducer(undefined, {});

describe('gameStatus Reducer', () => {
  it('initial state should be GAME_STATUS.READY', () => {
    expect(initialState).to.eql(GAME_STATUS.READY);
  });

  describe('on spaceKey pressed', () => {
    it('should change to PAUSED if current status is PLAYING', () => {
      const result = reducer(
        GAME_STATUS.PLAYING,
        ui.onKeyPressed(SPACE_KEY_CODE)
      );
      expect(result).to.eql(GAME_STATUS.PAUSED);
    });

    it('should change to PLAYING if current status is PAUSED', () => {
      const result = reducer(
        GAME_STATUS.PAUSED,
        ui.onKeyPressed(SPACE_KEY_CODE)
      );
      expect(result).to.eql(GAME_STATUS.PLAYING);
    });

    it('should change to READY if current status is ENDED', () => {
      const result = reducer(
        GAME_STATUS.ENDED,
        ui.onKeyPressed(SPACE_KEY_CODE)
      );
      expect(result).to.eql(GAME_STATUS.READY);
    });
  });

  it('should change to ENDED on GAME.COLLISION', () => {
    const result = reducer(
      GAME_STATUS.PLAYING,
      game.onCollision()
    );
    expect(result).to.eql(GAME_STATUS.ENDED);
  });

  it('should change to PLAYING on GAME.DIRECTION_CHANGED if status is READY', () => {
    const result = reducer(
      GAME_STATUS.READY,
      game.onDirectionChanged()
    );
    expect(result).to.eql(GAME_STATUS.PLAYING);
  });
});
