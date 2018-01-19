import { all, put, fork } from 'redux-saga/effects';
import { router } from 'redux-saga-router';

import editorSaga from './Editor/Editor.sagas';
import projectSaga from './Project/Project.sagas';
import { init } from './App.actions';

export function* onRoot() {
  yield put(init());
}

export default function* saga(history) {
  yield all([
    fork(router, history, {
      '/': onRoot,
      // '/project/:id?': onProject, TODO
    }),
    projectSaga(),
    editorSaga(),
  ]);
}
