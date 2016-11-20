import { mapProps, branch, renderComponent } from 'recompose';
import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const color = '#3E462F';

/* ------------------------ Dumb components ------------------------ */
const Rect = ({ x, y }) =>
  <rect x={x} y={y} width={1} height={1} fill={color} />;

Rect.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

const Polyline = ({ points }) =>
  <polyline
    points={points}
    style={{ fill: 'none', stroke: color }}
    strokeWidth={1}
    strokeLinecap={'square'}
    transform={'translate(0.5,0.5)'}
  />;

Polyline.propTypes = {
  points: PropTypes.string.isRequired,
};

/* --------------------------- Enhancers --------------------------- */

const polylineEnhancer = mapProps(({ keyPoints }) => ({
  points: keyPoints.map(({ x, y }) => `${x} ${y}`).join(' '),
}));

const rectEnhancer = mapProps(({ keyPoints }) => keyPoints.get(0));

const Snake = branch(
  ({ keyPoints }) => keyPoints.size > 1,
  renderComponent(polylineEnhancer(Polyline)),
  renderComponent(rectEnhancer(Rect))
)();

Snake.propTypes = {
  keyPoints: ImmutablePropTypes.listOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  })).isRequired,
};

export default Snake;
