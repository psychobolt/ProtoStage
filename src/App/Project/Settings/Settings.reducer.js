import { combineReducers } from 'redux';

import { Actions as CanvasActions } from 'App/Editor/Canvas/Canvas.actions';
import { Actions as WorldActions } from 'App/Editor/World/World.actions';

import initiaState from './Settings.state';

const canvasReducer = (state = initiaState.canvas, action) => {
  switch (action.type) {
    case CanvasActions.SET_GRID_SPACING: return { ...state, gridSpacing: action.payload.spacing };
    case CanvasActions.TOGGLE_AUTO_SYNC: return { ...state, autoSync: !state.autoSync };
    default: return state;
  }
};

const worldReducer = (state = initiaState.world, action) => {
  switch (action.type) {
    case WorldActions.SET_PIXELS_PER_METER:
      return { ...state, pixelsPerMeter: action.payload.value };
    case WorldActions.UPDATE_GRAVITY:
      return { ...state, gravity: { ...state.gravity, ...action.payload } };
    case WorldActions.UPDATE_MOUSE_FORCE: return { ...state, mouseForce: action.payload };
    case WorldActions.UPDATE_SPEED: return { ...state, speed: action.payload };
    default: return state;
  }
};

export default combineReducers({
  canvas: canvasReducer,
  world: worldReducer,
});
