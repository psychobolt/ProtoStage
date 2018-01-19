import { all } from 'redux-saga/effects';

import canvasSaga from './Canvas/Canvas.sagas';
import worldSaga from './World/World.sagas';

export default function* saga() {
  yield all([
    canvasSaga(),
    worldSaga(),
  ]);
}
