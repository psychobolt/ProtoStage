import editorReducer from './Editor/Editor.reducer';
import projectReducer from './Project/Project.reducer';
import { Actions as ProjectActions } from './Project/Project.actions';
import { Actions as AppActions } from './App.actions';
import { getProject } from './App.selectors';

export default (state = {}, action) => {
  switch (action.type) {
    case AppActions.INIT_APP: return {};
    default: {
      const { type } = action;
      if (ProjectActions.NEW_PROJECT === type
          || ProjectActions.LOAD_PROJECT === type
          || getProject({ app: state }).id) {
        return {
          ...state,
          editor: editorReducer(state.editor, action),
          project: projectReducer(state.project, action),
        };
      }
      return state;
    }
  }
};
