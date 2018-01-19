import { combineReducers } from 'redux';

import canvasReducer from './Canvas/Canvas.reducer';
import worldReducer from './World/World.reducer';

export default combineReducers({
  canvas: canvasReducer,
  world: worldReducer,
});
