import { createSelectorCreator } from 'reselect';
import R from 'ramda';

const memoizeOnGivenArguments = (func, argsToMemoize = []) => {
  let lastArgs = null;
  let lastResult = null;

  return (...args) => {
    const argsBeingTracked =
      R.type(argsToMemoize) === 'Array' && argsToMemoize.length > 0 ?
        argsToMemoize : R.range(0, args.length);

    if (
      lastArgs !== null &&
      lastArgs.length === args.length &&
      argsBeingTracked.every(index => args[index] === lastArgs[index])
    ) {
      return lastResult;
    }

    lastResult = func(...args);
    lastArgs = args;
    return lastResult;
  };
};

export default (argsToMemoize) => createSelectorCreator(
  memoizeOnGivenArguments,
  argsToMemoize
);
