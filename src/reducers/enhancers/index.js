import R from 'ramda';

import dimensions from './dimensions';
import newGame from './new-game';

export default R.compose(dimensions, newGame);
