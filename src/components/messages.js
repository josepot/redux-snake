import React, { PropTypes } from 'react';

const Messages = ({ position: { x, y }, main, sub }) =>
  main && sub && (
    <g textAnchor="middle" fontFamily="Verdana">
      <text
        x={x}
        y={y}
        fill="red"
        fontSize="1pt"
      >
        {main}
      </text>
      <text
        x={x}
        y={y + 1.5}
        fill="green"
        fontSize="0.75pt"
      >
        {sub}
      </text>
    </g>
  ) || null;

export const stateProps = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  main: PropTypes.string,
  sub: PropTypes.string,
};

Messages.propTypes = stateProps;

export default Messages;

