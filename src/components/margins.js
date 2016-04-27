import React, { PropTypes } from 'react';
import { COLS, ROWS, MARGIN } from '../config.js';

export const Margins = (props) => {
  const { viewbox } = props;
  const horizontalTo = viewbox.width + viewbox.x;
  const horizontalTop = viewbox.y + (0.5 * MARGIN.TOP);
  const horizontalBottom = ROWS + ((MARGIN.BOTTOM - 1) * 0.5);
  const verticalTo = viewbox.height + viewbox.y;
  const verticalLeft = viewbox.x + (0.5 * MARGIN.LEFT);
  const verticalRight = COLS + ((MARGIN.RIGHT - 1) * 0.5);

  return (
    <g stroke={'#CBC3BA'}>
    <line x1={viewbox.x} x2={horizontalTo} y1={horizontalTop} y2={horizontalTop} strokeWidth={MARGIN.TOP} />
    <line x1={viewbox.x} x2={horizontalTo} y1={horizontalBottom} y2={horizontalBottom} strokeWidth={MARGIN.BOTTOM} />

    <line y1={viewbox.y} y2={verticalTo} x1={verticalLeft} x2={verticalLeft} strokeWidth={MARGIN.LEFT} />
    <line y1={viewbox.y} y2={verticalTo} x1={verticalRight} x2={verticalRight} strokeWidth={MARGIN.RIGHT} />
    </g>
  );
};

Margins.propTypes = {
  viewbox: PropTypes.object.isRequired,
};
