import React, { PropTypes } from 'react';

const Food = ({ x, y }) => (
  <circle cx={x} cy={y} r={0.5} fill="#3E462F" transform="translate(0.5,0.5)" />
);

export const stateProps = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

Food.propTypes = stateProps;

export default Food;
