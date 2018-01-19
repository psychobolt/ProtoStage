import { all, put, select, takeEvery } from 'redux-saga/effects';

import { getCanvas, getCanvasSettings, getWorld } from 'App/App.selectors';

import { Actions as CanvasActions, linkPath, linkLayer } from '../Canvas/Canvas.actions';
import { Actions as WorldActions, addBody, addFixtures, removeFixtures, selectBody } from './World.actions';

function* addFixture(bodyId, pathId) {
  const effect = addFixtures(bodyId, [{ pathId }], true);
  yield put(linkPath(pathId, { fixtureId: effect.payload.fixtures[0].id }));
  yield put(effect);
}

function* onAddLayer(action) {
  const settings = yield select(getCanvasSettings);
  if (settings.autoSync) {
    const { id } = action.payload;
    const effect = addBody(true);
    yield put(linkLayer(id, { bodyId: effect.payload.id }));
    yield put(effect);
  }
}

function* onAddPath(action) {
  const { autoSync, layerLinks } = yield select(getCanvas);
  const { id: pathId, layer, visible } = action.payload;
  const { bodyId } = layerLinks[layer];
  if (visible === false) {
    return;
  }
  if (autoSync) yield addFixture(bodyId, pathId);
}

function* onUpdatePaths(action) {
  const { autoSync, pathLinks, layerLinks } = yield select(getCanvas);
  if (autoSync) {
    yield all(action.payload.map(path => {
      const { id: pathId, layer, closed } = path;
      const pathLink = pathLinks[pathId] || {};
      if (pathLink.fixtureId || !closed) {
        return null;
      }
      const { bodyId } = layerLinks[layer];
      return addFixture(bodyId, pathId);
    }));
  }
}

function* onRemovePaths(action) {
  const { fixtureIds, fixtures } = yield select(getWorld);
  yield put(removeFixtures(fixtureIds.filter(id =>
    action.payload.ids.includes(fixtures[id].pathId)), true));
}

function* onAddBody(action) {
  yield put(selectBody(action.payload.id));
}

function* onRemoveLayers() {
  const { fixtures, fixtureIds } = yield select(getWorld);
  const { pathIds } = yield select(getCanvas);
  const ids = fixtureIds.filter(id => !pathIds.includes(fixtures[id].pathId));
  if (ids.length) {
    yield put(removeFixtures(ids, true));
  }
}

export default function* saga() {
  yield takeEvery(CanvasActions.ADD_LAYER, onAddLayer);
  yield takeEvery(CanvasActions.ADD_PATH, onAddPath);
  yield takeEvery(CanvasActions.UPDATE_PATHS, onUpdatePaths);
  yield takeEvery(CanvasActions.REMOVE_LAYERS, onRemoveLayers);
  yield takeEvery(CanvasActions.REMOVE_PATHS, onRemovePaths);
  yield takeEvery(WorldActions.ADD_BODY, onAddBody);
}
