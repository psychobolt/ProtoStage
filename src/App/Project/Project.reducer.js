import { combineReducers } from 'redux';
import undoable, { ActionTypes } from 'redux-undo';

import { Actions as GlobalActions } from 'shared/actions';

import { Actions as ProjectActions } from './Project.actions';
import canvasReducer from './History/Canvas/Canvas.reducer';
import worldReducer from './History/World/World.reducer';
import historyInitialState from './History/History.state';
import settingsReducer from './Settings/Settings.reducer';

const historyReducer = undoable(combineReducers({
  canvas: canvasReducer,
  world: worldReducer,
}), {
  undoType: GlobalActions.UNDO,
  redoType: GlobalActions.REDO,
  initTypes: ['@@redux-undo/INIT', ProjectActions.NEW_PROJECT],
  clearHistoryType: [ActionTypes.CLEAR_HISTORY, ProjectActions.LOAD_PROJECT],
  neverSkipReducer: true,
  filter: action => !action.meta || !action.meta.skipHistory,
  syncFilter: true,
});

const reducer = (state = {}, action) => {
  switch (action.type) {
    case ProjectActions.NEW_PROJECT: return { ...state, ...action.payload };
    case ProjectActions.LOAD_PROJECT: {
      const { project, ...rest } = action.payload;
      return { ...state, ...rest };
    }
    default: return state;
  }
};

export default ({ history = historyInitialState, settings, ...rest } = {}, action) => reducer({
  ...rest,
  history: historyReducer(history, action),
  settings: settingsReducer(settings, action),
}, action);
