import assert from 'assert';
import rewire from 'rewire';
import { List } from 'immutable';

const selectors = rewire('../src/queries/snake');

describe('Selectors', () => {
  const didHeadHitBody = selectors.__get__('didHeadHitBody');

  describe('getHeadHitBody', () => {
    it('should hit the body', () => {
      const keyPositions = List.of(
        { x: 10, y: 13 },
        { x: 14, y: 13 },
        { x: 14, y: 14 },
        { x: 10, y: 14 },
        { x: 10, y: 10 }
      );
      assert(didHeadHitBody(keyPositions.first(), keyPositions));
    });
  });
});
