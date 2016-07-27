import { expect } from 'chai';

import { game } from '../../src/actions';
import reducer from '../../src/reducers/food-eaten';

const testingState = 4;

describe('foodEaten Reducer', () => {
  it('initial state should be 0', () => {
    const initialState = reducer(undefined, {});
    expect(initialState).to.eql(0);
  });

  it('should reinitialize the state on GAME.NEW', () => {
    const result = reducer(testingState, game.onStartNewGame());
    expect(result).to.eql(0);
  });

  it('should increase on GAME.FOOD_EATEN', () => {
    const result = reducer(testingState, game.onFoodEaten());
    expect(result).to.eql(testingState + 1);
  });
});

