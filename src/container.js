import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Margins } from './components/margins.js';
import { TICK_FREQUENCY, ROWS, COLS, MARGIN } from './config.js';
import { PLAYING, PAUSED, ENDED, READY } from './reducers/game-status.js';
import { ui } from './selectors.js';
import { tick, resize, newDirection, pause, resume, newGame } from './actions.js';

const KEYBOARD_DIRECTIONS = {
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
};
const SPACE_KEY_CODE = 32;

export class App extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    this.nextTick = () => {
      if (this.props.gameStatus === PLAYING) {
        dispatch(tick());
      }
    };

    this.updateDimensions = () => {
      dispatch(resize(window.innerWidth, window.innerHeight));
    };

    this.pressKey = (e) => {
      const key = e.keyCode || e.which;
      const direction = KEYBOARD_DIRECTIONS[key];

      if (direction && [PLAYING, READY].includes(this.props.gameStatus)) {
        dispatch(newDirection(direction, this.props.tickNumber));
      } else if (key === SPACE_KEY_CODE) {
        switch (this.props.gameStatus) {
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
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
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

    const snakePoints = (snakeKeyPositions.size > 1 ?
      snakeKeyPositions :
      snakeKeyPositions.push(snakeKeyPositions.first())
    ).map(pos => `${pos.x} ${pos.y}`).join(' ');

    return (
      <svg width={width} height={height} viewBox={viewboxStr}>
        <Margins viewbox={viewbox} />
        <rect x={-0.5} y={-0.5} width={COLS} height={ROWS} fill="#9BB07B" />
        <polyline
          points={snakePoints} style={{ fill: 'none', stroke: '#3E462F' }}
          strokeWidth={1} strokeLinecap={'square'}
        />
        <circle cx={food.x} cy={food.y} r={0.5} fill="#3E462F" />
      </svg>
    );
  }
}

App.propTypes = {
  gameStatus: PropTypes.string.isRequired,
  tickNumber: PropTypes.number.isRequired,
  food: PropTypes.object.isRequired,
  snakeKeyPositions: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(ui)(App);
