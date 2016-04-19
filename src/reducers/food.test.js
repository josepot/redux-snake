import assert from 'assert';
import foodReducer from './food.js';
import R from 'ramda';
import { ROWS, COLS } from '../config';

let fakeRandomNumber;
foodReducer.__Rewire__('getRandomInt', () => fakeRandomNumber);

describe('Food Reducer', () => {
  const snakePositions = [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
    { x: 4, y: 4 }, { x: 5, y: 4 },
  ];
  const getFoodPosition = foodReducer.__get__('getFoodPosition');

  describe('getFoodPosition', () => {
    it('should never return a food position that is part of the Snake', () => {
      const nAvailablePositions = (ROWS * COLS) - snakePositions.length;
      R.range(0, nAvailablePositions).forEach((randomNumber) => {
        fakeRandomNumber = randomNumber;
        const result = getFoodPosition(snakePositions);
        assert(
          R.contains(result, snakePositions) === false,
          `RandomNumber: ${randomNumber} got x:${result.x}, y:${result.y}`
        );
      });
    });
  });
});
