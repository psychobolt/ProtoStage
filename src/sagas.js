import appSaga from './App/App.sagas';

export default function* saga(history) {
  yield appSaga(history);
}
