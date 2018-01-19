import { push } from 'react-router-redux';
import { put, takeEvery, select } from 'redux-saga/effects';

import { getProject } from '../App.selectors';
import { Actions, fetchProject } from './Project.actions';

export function* onProject({ id }) {
  const project = yield select(getProject);
  if (id !== project.Id) {
    yield put(fetchProject(id));
  }
}

function* onNewProject() {
  yield put(push('/project'));
}

function* onLoadProject(action) {
  yield put(push(`/project/${action.payload.id}`));
}

export default function* saga() {
  yield takeEvery(Actions.NEW_PROJECT, onNewProject);
  yield takeEvery(Actions.LOAD_PROJECT, onLoadProject);
}
