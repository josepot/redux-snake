import { expect } from 'chai';

import { GROWTH_FACTOR } from '../../src/config';
import { game } from '../../src/actions';
import reducer from '../../src/reducers/growth-buffer';

const initialState = reducer(undefined, {});

describe('growthBuffer reducer', () => {
  it('initial state should be 0', () => {
    expect(initialState).to.eql({
      previous: undefined,
      current: 0,
    });
  });

  it('on GAME.NEW the state should be re-initialized to 0', () => {
    const currentState = { current: 5 };
    const result = reducer(currentState, game.onStartNewGame());
    expect(result).to.eql({
      previous: 5,
      current: 0,
    });
  });

  it('on GAME.FOOD_EATEN the state should increase the GROWTH_FACTOR', () => {
    const currentState = { previous: 5, current: 4 };
    const result = reducer(currentState, game.onFoodEaten());
    expect(result).to.eql({
      previous: currentState.current,
      current: currentState.current + GROWTH_FACTOR,
    });
  });

  describe('on GAME.TICK', () => {
    it('should decrease', () => {
      const currentState = { previous: 5, current: 4 };
      const result = reducer(currentState, game.onTick());
      expect(result).to.eql({
        previous: currentState.current,
        current: currentState.current - 1,
      });
    });

    it('should not decrease below zero', () => {
      const currentState = { previous: 1, current: 0 };
      const result = reducer(currentState, game.onTick());
      expect(result).to.eql({
        previous: currentState.current,
        current: currentState.current,
      });
    });
  });

  describe('on GAME.COLLISION', () => {
    it('should rollback to the previous state', () => {
      const currentState = { previous: 1, current: 0 };
      const result = reducer(currentState, game.onCollision());
      expect(result).to.eql({
        current: currentState.previous,
      });
    });
  });
});
