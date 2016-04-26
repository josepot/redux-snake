import { Margins } from '../components/margins.js';
import { TICK_FREQUENCY, ROWS, COLS, MARGIN } from '../config';
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
    const { food, width, height, snakeKeyPositions } = this.props;
    const viewbox = {
      x: 0 - MARGIN.LEFT - 0.5,
      y: 0 - MARGIN.TOP - 0.5,
      width: COLS + MARGIN.LEFT + MARGIN.RIGHT,
      height: ROWS + MARGIN.TOP + MARGIN.BOTTOM,
    };
    const viewboxStr = `${viewbox.x} ${viewbox.y} ${viewbox.width} ${viewbox.height}`;

    const snake = snakeKeyPositions.unshift(snakeKeyPositions.first()).map(
      pos => `${pos.x} ${pos.y}`
    ).join(' ');

    return (
      <svg width={width} height={height} viewBox={viewboxStr}>
      <Margins viewbox={viewbox} />
      <rect x={-0.5} y={-0.5} width={COLS} height={ROWS} fill="#9BB07B" />
      <polyline
        points={snake} style={{ fill: 'none', stroke: '#3E462F' }}
        strokeWidth={1} strokeLinecap={'square'}
      />
      <circle cx={food.x} cy={food.y} r={0.5} fill="#3E462F" />
      </svg>
    );
  }
}

App.propTypes = {
  gameStatus: PropTypes.string.isRequired,
  tick: PropTypes.number.isRequired,
  food: PropTypes.object.isRequired,
  snakeKeyPositions: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(ui)(App);
