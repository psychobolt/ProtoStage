import 'globals';
import React from 'react';
import { render } from 'react-dom';
import { routerMiddleware } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import { forwardToMain, replayActionRenderer } from 'electron-redux';
import { createHashHistory } from 'history';

import saga from './sagas';
import reducer from './reducer';
import { configureStore } from './shared/store';
import Routes from './routes';

const createSaga = history => function* rootSaga() { yield saga(history); };

let props;
if (module.hot && module.hot.data) {
  props = {
    store: module.hot.data.store,
    history: module.hot.data.history,
  };
} else {
  const history = createHashHistory();
  props = {
    store: configureStore(reducer, undefined, [
      forwardToMain,
      routerMiddleware(history),
    ], createSaga(history)),
    history,
  };
}

replayActionRenderer(props.store);

render(
  <AppContainer><Routes {...props} /></AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(data => {
    props.store.replaceReducer(reducer);
    Object.assign(data, props);
  });
}
