import R from 'ramda';

const getMovementTransformation = (direction, increment) => {
  const add = R.add(increment);
  const sub = R.add(0 - increment);
  const movements = {
    UP: { y: sub },
    DOWN: { y: add },
    LEFT: { x: sub },
    RIGHT: { x: add },
  };
  return movements[direction];
};

export default (position, direction, increment = 1) => R.evolve(
  getMovementTransformation(direction, increment),
  position
);
