import 'globals';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'connected-react-router';
import { forwardToMain, replayActionRenderer } from 'electron-redux';
import { createHashHistory } from 'history';

import saga from './sagas';
import reducer from './reducer';
import { configureStore } from './shared/store';
import Routes from './routes';

const createSaga = history => function* rootSaga() { yield saga(history); };
const history = createHashHistory();
const store = configureStore(reducer(history), undefined, [
  forwardToMain,
  routerMiddleware(history),
], createSaga(history));

replayActionRenderer(store);

ReactDOM.render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(require('./reducer').default); // eslint-disable-line global-require
  });
}
