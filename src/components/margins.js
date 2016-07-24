import React from 'react';
import { MARGIN, COLS, ROWS } from '../config';

const xStart = MARGIN.LEFT * -1;
const yStart = MARGIN.TOP * -1;
const totalWidth = COLS + MARGIN.LEFT + MARGIN.RIGHT;
const totalHeight = ROWS + MARGIN.TOP + MARGIN.BOTTOM;

export default () => (
  <g fill={'#CBC3BA'}>
    <rect x={xStart} y={yStart} height={MARGIN.TOP} width={totalWidth} />
    <rect x={xStart} y={ROWS} height={MARGIN.BOTTOM} width={totalWidth} />

    <rect x={xStart} y={yStart} height={totalHeight} width={MARGIN.LEFT} />
    <rect x={COLS} y={yStart} height={totalHeight} width={MARGIN.RIGHT} />
  </g>
);
