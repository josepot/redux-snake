import { TICK_FREQUENCY } from '../config';
import { PLAYING, PAUSED, ENDED, READY } from '../reducers/game-status.js';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ui } from '../selectors';
import { tick, resize, newDirection, pause, resume, newGame } from '../actions';
import { KEYBOARD_DIRECTIONS, KEYBOARD_KEYS } from '../constants';

class App extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    const me = this;

    this.nextTick = () => {
      if (me.props.gameStatus === PLAYING) {
        dispatch(tick());
      }
    };

    this.upateDimensions = () => {
      dispatch(resize(window.innerWidth, window.innerHeight));
    };

    this.pressKey = (e) => {
      const key = e.keyCode || e.which;
      const direction = KEYBOARD_DIRECTIONS[key];
      if (direction && [PLAYING, READY].includes(me.props.gameStatus)) {
        dispatch(newDirection(direction, me.props.tick));
      } else if (key === KEYBOARD_KEYS.SPACE) {
        switch (me.props.gameStatus) {
          case PLAYING:
            dispatch(pause());
            break;
          case PAUSED:
            dispatch(resume());
            break;
          case ENDED:
            dispatch(newGame());
            break;
          default:
        }
      }
    };
  }

  componentDidMount() {
    this.props.dispatch(resize(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', this.upateDimensions);
    window.setInterval(this.nextTick, TICK_FREQUENCY);
    document.addEventListener('keydown', this.pressKey, true);
  }

  render() {
    const { radius, frame, port, food, width, height, snakePoints } = this.props;

    return (
      <svg width={width} height={height}>
      <rect x={frame.x} y={frame.y} width={frame.width} height={frame.height} fill="#CBC3BA" />
      <rect x={port.x} y={port.y} width={port.width} height={port.height} fill="#9BB07B" />
      <polyline
        points={snakePoints} style={{ fill: 'none', stroke: '#3E462F' }}
        strokeWidth={radius * 2} strokeLinecap={'square'}
      />
      <circle cx={food.x} cy={food.y} r={radius} fill="#3E462F" />
      </svg>
    );
  }
}

App.propTypes = {
  gameStatus: PropTypes.string.isRequired,
  tick: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  frame: PropTypes.object.isRequired,
  port: PropTypes.object.isRequired,
  food: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  snakePoints: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(ui)(App);
