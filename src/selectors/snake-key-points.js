import { createSelector } from 'reselect';
import { getSnake } from './raw-selectors';

const getSnakeKeyPointsCombiner = snake => snake.filter(
  (current, idx, iter) => {
    const prev = idx > 0 ? iter.get(idx - 1) : undefined;
    const next = iter.get(idx + 1);

    if (prev === undefined || next === undefined) return true;

    const commonPrevProp = current.x === prev.x ? 'x' : 'y';
    const commonNextProp = current.x === next.x ? 'x' : 'y';
    return commonPrevProp !== commonNextProp;
  }
);

export default createSelector(
  [getSnake],
  getSnakeKeyPointsCombiner
);
