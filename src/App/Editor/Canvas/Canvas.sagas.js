import { takeEvery, put } from 'redux-saga/effects';

import { Actions as WorldActions } from '../World/World.actions';
import { Actions as CanvasActions, selectLayer } from './Canvas.actions';

function* onAddLayer(action) {
  yield put(selectLayer(action.payload.id));
}

function* onRemoveBodies() {
  // TODO remove path links
}

export default function* saga() {
  yield takeEvery(CanvasActions.ADD_LAYER, onAddLayer);
  yield takeEvery(WorldActions.REMOVE_BODIES, onRemoveBodies);
}
