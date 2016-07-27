import { expect } from 'chai';

import { game } from '../../src/actions';
import reducer from '../../src/reducers/food-generator-offset';

const initialState = reducer(undefined, {});
const foodGeneratorSeed = 321;

describe('foodGeneratorOffset Reducer', () => {
  it('initial state should be 0', () => {
    expect(initialState).to.eql(0);
  });

  it('should set the initial seed on GAME.INIT', () => {
    const result = reducer(initialState, game.onInit(foodGeneratorSeed));
    expect(result).to.eql(foodGeneratorSeed);
  });

  it('should increase on GAME.FOOD_EATEN', () => {
    const result = reducer(foodGeneratorSeed, game.onFoodEaten());
    expect(result).to.eql(foodGeneratorSeed + 1);
  });

  it('should increase on GAME.NEW', () => {
    const result = reducer(foodGeneratorSeed, game.onFoodEaten());
    expect(result).to.eql(foodGeneratorSeed + 1);
  });
});

