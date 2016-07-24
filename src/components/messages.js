import React, { PropTypes } from 'react';
import { ROWS, COLS, MARGIN } from '../config.js';

const x = COLS / 2;
const y = ROWS + (MARGIN.BOTTOM / 2.25);

const Messages = ({ main, sub }) =>
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
        y={y + 1.25}
        fill="green"
        fontSize="0.75pt"
      >
        {sub}
      </text>
    </g>
  ) || null;

export const stateProps = {
  main: PropTypes.string,
  sub: PropTypes.string,
};

Messages.propTypes = stateProps;

export default Messages;

