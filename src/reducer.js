import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import appReducer from './App/App.reducer';
import { frameworkReducers } from './Framework';

export default combineReducers({
  app: appReducer,
  ...frameworkReducers,
  routing: routerReducer,
});
