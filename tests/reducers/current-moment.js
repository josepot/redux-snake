import { expect } from 'chai';

import { game } from '../../src/actions';
import reducer from '../../src/reducers/current-moment';

const testingState = 4;

describe('currentMoment Reducer', () => {
  it('initial state should be 0', () => {
    const initialState = reducer(undefined, {});
    expect(initialState).to.eql(0);
  });

  it('should reinitialize the state on GAME.NEW', () => {
    const result = reducer(testingState, game.onStartNewGame());
    expect(result).to.eql(0);
  });

  it('should increase on GAME.TICK', () => {
    const result = reducer(testingState, game.onTick());
    expect(result).to.eql(testingState + 1);
  });

  it('should decrease on GAME.COLLISION', () => {
    const result = reducer(testingState, game.onCollision());
    expect(result).to.eql(testingState - 1);
  });
});

