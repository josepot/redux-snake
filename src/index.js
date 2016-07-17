import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/app';
import rootSaga from './sagas';
import store from './store';

store.runSaga(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
