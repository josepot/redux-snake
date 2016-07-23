import React, { PropTypes } from 'react';

const color = '#3E462F';
const Snake = ({ points }) => (
  points.length === 1 ?
    <rect
      x={points[0].x}
      y={points[0].y}
      width={1}
      height={1}
      fill={color}
    /> :
    <polyline
      points={points.map(({ x, y }) => `${x} ${y}`).join(' ')}
      style={{ fill: 'none', stroke: color }}
      strokeWidth={1}
      strokeLinecap={'square'}
      transform={'translate(0.5,0.5)'}
    />
);

export const stateProps = {
  points: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  })).isRequired,
};

Snake.propTypes = stateProps;

export default Snake;
