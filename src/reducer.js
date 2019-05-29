import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import appReducer from './App/App.reducer';
import { frameworkReducers } from './Framework';

export default history => combineReducers({
  ...appReducers,
  ...frameworkReducers,
  router: connectRouter(history),
});
