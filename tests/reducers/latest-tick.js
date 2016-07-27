import { expect } from 'chai';

import { game } from '../../src/actions';
import reducer from '../../src/reducers/latest-tick';
import getNowInMs from '../../src/utils/get-now-in-ms';

describe('latestTick Reducer', () => {
  it('initial state should be now', () => {
    const initialState = reducer(undefined, {});
    expect(initialState).to.eql(null);
  });

  it('should update to the current moment in ms on GAME.TICK', () => {
    const result = reducer(undefined, game.onTick());
    expect(result).to.eql(getNowInMs());
  });
});
