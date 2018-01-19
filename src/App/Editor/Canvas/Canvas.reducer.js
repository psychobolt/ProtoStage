import initialState from './Canvas.state';
import { Actions as CanvasActions } from './Canvas.actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case CanvasActions.ZOOM: return { ...state, zoomLevel: action.payload.level };
    default: return state;
  }
};
