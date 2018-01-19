import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export function* noopSaga() {} // eslint-disable-line no-empty-function

export function configureStore(reducer, initialState, middlewares, sagas = noopSaga) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares, sagaMiddleware)),
  );
  sagaMiddleware.run(sagas);
  return store;
}
