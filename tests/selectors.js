import assert from 'assert';
import rewire from 'rewire';
import { List } from 'immutable';
import { UP, DOWN, LEFT, RIGHT } from '../src/reducers/directions.js';

const selectors = rewire('../src/selectors.js');

describe('Selectors', () => {
  const directions = List.of(
    { tick: 11, direction: RIGHT },
    { tick: 10, direction: UP },
    { tick: 8, direction: LEFT },
    { tick: 5, direction: UP },
    { tick: 3, direction: LEFT },
    { tick: 0, direction: DOWN }
  );
  const vectors = List.of(
    { direction: LEFT, len: 2 },
    { direction: UP, len: 3 },
    { direction: LEFT, len: 2 }
  );
  const head = { x: 1, y: 1 };

  const getSnakeVectors = selectors.__get__('_getSnakeVectors');
  const getSnakeKeyPositions = selectors.__get__('_getSnakeKeyPositions');
  const getAllSnakePositions = selectors.__get__('_getAllSnakePositions');

/*
 *  In a case like the following, where the snake is moving towards the left:
 *
 *    0 1 2 3 4 5
 *    _ _ _ _ _ _
 * 0 | | | | | | |
 * 1 | |x|x|x| | |
 * 2 | | | |x| | |
 * 3 | | | |x| | |
 * 4 | | | |x|x|x|
 * 5 | | | | | | |
 *    ‾ ‾ ‾ ‾ ‾ ‾
 *  It should return: [
 *    { direction: 'LEFT', len: 2 },
 *    { direction: 'UP', len: 3 },
 *    { direction: 'LEFT', len: 2 },
 *  ]
 *  Notice that the sum of the len of the vectors will always be one unit less
 *  than the body length. This is because the vectors are from the head of the snake.
 * */
  describe('getSnakeVectors', () => {
    it('should ignore the non relevant directions and get the expected vectors', () => {
      const latestTick = 10;
      const minTick = 10;
      const expectedResult = [{ direction: LEFT, len: 0 }];
      const result = getSnakeVectors(latestTick, directions, minTick);
      assert.deepEqual(result.toArray(), expectedResult);
    });

    it('when the snake has only one position there should return one vector with len = 0', () => {
      const latestTick = 10;
      const minTick = 3;
      const result = getSnakeVectors(latestTick, directions, minTick);
      assert.deepEqual(result.toArray(), vectors.toArray());
    });
  });

/*
 *  In a case like this:
 *
 *  x 0 1 2 3 4 5
 * y  _ _ _ _ _ _
 * 0 | | | | | | |
 * 1 | |x|x|x| | |
 * 2 | | | |x| | |
 * 3 | | | |x| | |
 * 4 | | | |x|x|x|
 * 5 | | | | | | |
 *    ‾ ‾ ‾ ‾ ‾ ‾
 *  It should return: [
 *    { x: 1, y: 1 },
 *    { x: 3, y: 1 },
 *    { x: 3, y: 4 },
 *    { x: 5, y: 4 }
 *  ]
 * */
  describe('getSnakeKeyPositions', () => {
    it('should return the extremes and the turning points of the snake', () => {
      const expectedResult = [
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 4 },
        { x: 5, y: 4 },
      ];
      const result = getSnakeKeyPositions(vectors, head);
      assert.deepEqual(result.toArray(), expectedResult);
    });
  });

  describe('getAllSnakePositions', () => {
    it('should return all the absolute positions where the snake is in', () => {
      const expectedResult = [
        { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
        { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
        { x: 4, y: 4 }, { x: 5, y: 4 },
      ];
      assert.deepEqual(getAllSnakePositions(vectors, head), expectedResult);
    });
  });
});
