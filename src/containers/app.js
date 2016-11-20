import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import storeConnector from '../selectors/app';

import Background from '../components/background';
import Food from '../components/food';
import Margins from '../components/margins';
import Messages from '../components/messages';
import Snake from '../components/snake';

const App = ({
  dimensions: { width, height },
  foodProps,
  messagesProps,
  snakeProps,
  viewboxStr,
}) => (
  <svg width={width} height={height} viewBox={viewboxStr}>
    <Margins />
    <Background />
    <Snake {...snakeProps} />
    {
      foodProps ? <Food {...foodProps} /> : null
    }
    <Messages {...messagesProps} />
  </svg>
);

App.propTypes = {
  dimensions: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  foodProps: PropTypes.shape(Food.stateProps),
  messagesProps: PropTypes.shape(Messages.stateProps),
  snakeProps: PropTypes.shape(Snake.stateProps),
  viewboxStr: PropTypes.string.isRequired,
};

export default connect(storeConnector)(App);
