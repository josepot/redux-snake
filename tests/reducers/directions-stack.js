import { Stack } from 'immutable';
import { expect } from 'chai';

import { game } from '../../src/actions';
import reducer from '../../src/reducers/directions-stack';
import { initialHead } from '../../src/config';
import { LEFT, DOWN } from '../../src/constants';

const initialState = reducer(undefined, {});

describe('directionsStack Reducer', () => {
  it('initial state should be an empty Stack', () => {
    expect(initialState).to.eql(new Stack());
  });

  describe('onDirectionChanged', () => {
    it(
      'on first direction change: should generate a Stack with one element, ' +
      'and its position should be equal to the initialHead', () => {
      const direction = LEFT;
      const moment = 0;

      const result = reducer(initialState, game.onDirectionChanged(direction, moment));

      expect(result).to.eql(Stack.of({
        direction,
        moment,
        position: initialHead,
      }));
    });

    it('on subsequent direction changes it should calculate the position', () => {
      const currentDirections = Stack.of({
        direction: LEFT,
        moment: 0,
        position: { x: 20, y: 20 },
      });
      const currentMoment = 10;
      const newDirection = DOWN;

      const result = reducer(
        currentDirections,
        game.onDirectionChanged(newDirection, currentMoment)
      );

      expect(result).to.eql(currentDirections.push({
        direction: newDirection,
        moment: currentMoment,
        position: { x: 10, y: 20 },
      }));
    });

    it(
      'if the currentMoment is the same as the last direction moment, ' +
      'the new direction element in the stack should increase that moment', () => {
      const currentDirections = Stack.of({
        direction: DOWN,
        moment: 10,
        position: { x: 10, y: 20 },
      }, {
        direction: LEFT,
        moment: 0,
        position: { x: 20, y: 20 },
      });
      const currentMoment = 10;
      const newDirection = LEFT;

      const result = reducer(
        currentDirections,
        game.onDirectionChanged(newDirection, currentMoment)
      );

      expect(result).to.eql(currentDirections.push({
        direction: newDirection,
        moment: currentMoment + 1,
        position: { x: 10, y: 21 },
      }));
    });
  });
});

