import { combineReducers } from 'redux';

import canvasReducer from './Canvas/Canvas.reducer';

export default combineReducers({
  canvas: canvasReducer,
});
