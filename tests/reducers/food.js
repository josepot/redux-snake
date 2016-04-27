import assert from 'assert';
import R from 'ramda';
import foodReducer from '../../src/reducers/food.js';
import { ROWS, COLS } from '../../src/config.js';
import { positionToIndex } from '../../src/utils.js';

let fakeRandomNumber;
foodReducer.__Rewire__('getRandomInt', () => fakeRandomNumber);

describe('Food Reducer', () => {
  const getFoodPosition = foodReducer.__get__('getFoodPosition');
  const nGridPositions = ROWS * COLS;
  const halfPositions = Math.ceil(nGridPositions / 2);
  const quarterPositions = Math.ceil(nGridPositions / 4);
  const snakes = [
    R.range(0, halfPositions),
    R.range(halfPositions, nGridPositions),
    R.range(quarterPositions, nGridPositions - quarterPositions),
    [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
      { x: 4, y: 4 }, { x: 5, y: 4 },
    ].map(positionToIndex),
  ];

  const testSnake = (snakePositions) => {
    snakePositions.forEach((randomNumber) => {
      fakeRandomNumber = randomNumber;
      const result = getFoodPosition(snakePositions);
      assert(
        R.contains(result, snakePositions) === false,
        `RandomNumber: ${randomNumber} got x:${result.x}, y:${result.y}`
      );
    });
  };

  describe('getFoodPosition', () => {
    it('should never return a food position that is part of the Snake', () => {
      snakes.forEach(testSnake);
    });
  });
});
