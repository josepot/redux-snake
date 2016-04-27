import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import App from './container.js';
import configureStore from './store.js';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
