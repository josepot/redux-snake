import React, { PropTypes } from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import storeConnector from '../queries/app';
import { ui } from '../actions';

import Background from '../components/background';
import Food from '../components/food';
import Margins from '../components/margins';
import Snake from '../components/snake';

const App = ({
  dimensions: { width, height },
  foodProps,
  marginProps,
  snakeProps,
  viewboxStr,
}) => (
  <svg width={width} height={height} viewBox={viewboxStr}>
    <Margins {...marginProps} />
    <Background />
    <Snake {...snakeProps} />
    {
      foodProps ? <Food {...foodProps} /> : null
    }
  </svg>
);

const stateProps = {
  dimensions: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  foodProps: PropTypes.shape(Food.stateProps),
  marginProps: PropTypes.shape(Margins.stateProps),
  snakeProps: PropTypes.shape(Snake.stateProps),
  viewboxStr: PropTypes.string.isRequired,
};

const handlers = {
  dimensionsUpdateDispatcher: PropTypes.func.isRequired,
  keyPressedDispatcher: PropTypes.func.isRequired,
};

App.propTypes = {
  ...stateProps,
  ...handlers,
};

const enhancedApp = compose(
  withHandlers({
    onDimensionsUpdated: props => () =>
      props.dimensionsUpdateDispatcher(window.innerWidth, window.innerHeight),
    onKeyPressed: props => e =>
      props.keyPressedDispatcher(e.keyCode || e.which),
  }),
  lifecycle({
    componentDidMount() {
      this.props.onDimensionsUpdated();
      window.addEventListener('resize', this.props.onDimensionsUpdated);
      document.addEventListener('keydown', this.props.onKeyPressed, true);
    },
  })
)(App);

export default connect(
  storeConnector,
  {
    dimensionsUpdateDispatcher: ui.onWindowResized,
    keyPressedDispatcher: ui.onKeyPressed,
  }
)(enhancedApp);
