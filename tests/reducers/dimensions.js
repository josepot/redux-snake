import { expect } from 'chai';

import { ui } from '../../src/actions';
import reducer from '../../src/reducers/dimensions';

const initialState = reducer(undefined, {});

describe('dimensions Reducer', () => {
  it('initial state should be 800x600', () => {
    expect(initialState).to.eql({ width: 800, height: 600 });
  });

  it('should update on UI.WINDOW_RESIZED', () => {
    const width = 900;
    const height = 700;
    const result = reducer(initialState, ui.onWindowResized(width, height));
    expect(result).to.eql({ width, height });
  });
});

