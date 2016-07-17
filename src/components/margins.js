import React, { PropTypes } from 'react';

const Margins = ({
  horizontal: {
    xStart, xEnd, top, bottom,
  },
  vertical: {
    yStart, yEnd, left, right,
  },
}) => (
  <g stroke={'#CBC3BA'}>
    {/* Margin Top */}
    <line x1={xStart} x2={xEnd} y1={top.y} y2={top.y} strokeWidth={top.width} />
    {/* Margin Bottom */}
    <line x1={xStart} x2={xEnd} y1={bottom.y} y2={bottom.y} strokeWidth={bottom.width} />

    {/* Margin Left */}
    <line y1={yStart} y2={yEnd} x1={left.x} x2={left.x} strokeWidth={left.width} />
    {/* Margin Right */}
    <line y1={yStart} y2={yEnd} x1={right.x} x2={right.x} strokeWidth={right.width} />
  </g>
);

export const stateProps = {
  horizontal: PropTypes.shape({
    xStart: PropTypes.number.isRequired,
    xEnd: PropTypes.number.isRequired,
    top: PropTypes.shape({
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    bottom: PropTypes.shape({
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  vertical: PropTypes.shape({
    yStart: PropTypes.number.isRequired,
    yEnd: PropTypes.number.isRequired,
    left: PropTypes.shape({
      x: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    right: PropTypes.shape({
      x: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
  }).isRequired,
};

Margins.propTypes = stateProps;

export default Margins;
