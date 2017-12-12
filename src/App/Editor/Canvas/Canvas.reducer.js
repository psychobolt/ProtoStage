import undoable, { excludeAction } from 'redux-undo';

import initialState from './Canvas.state';
import { Actions } from './Canvas.actions';
import { Actions as GlobalActions } from '../../../shared/actions';

export default undoable((state = initialState, action) => {
  switch (action.type) {
    case Actions.ADD_PATH: {
      const { payload } = action;
      const { id, selected } = payload;
      const { pathIds, selectedPathIds } = state;
      return {
        ...state,
        paths: {
          ...state.paths,
          [id]: payload,
        },
        pathIds: pathIds.concat(id),
        selectedPathIds: selected ? selectedPathIds.concat(id) : selectedPathIds,
      };
    }
    case Actions.REMOVE_PATHS: {
      const { ids } = action.payload;
      let { paths, pathIds, selectedPathIds } = state;
      pathIds = pathIds.filter(pathId => !ids.includes(pathId));
      paths = pathIds.reduce((rest, id) => ({ ...rest, [id]: paths[id] }), {});
      selectedPathIds = selectedPathIds.filter(pathId => !ids.includes(pathId));
      return { ...state, paths, pathIds, selectedPathIds };
    }
    case Actions.UPDATE_PATH: {
      const { payload } = action;
      const { id } = payload;
      const { paths } = state;
      const newState = {
        ...state,
        paths: {
          ...paths,
          [id]: {
            ...paths[id],
            ...payload,
          },
        },
      };
      let { selectedPathIds } = state;
      if (newState.paths[id].selected) {
        if (!selectedPathIds.includes(id)) {
          selectedPathIds = selectedPathIds.concat(id);
        }
      } else {
        const index = selectedPathIds.indexOf(id);
        if (index > -1) {
          selectedPathIds = selectedPathIds.slice(0, index - 1)
            .concat(selectedPathIds.slice(index + 1));
        }
      }
      return {
        ...newState,
        selectedPathIds,
      };
    }
    case Actions.SELECT_PATHS: {
      const { selectedPathIds } = action.payload;
      const { paths, pathIds } = state;
      const update = {};
      pathIds.forEach(id => {
        const path = paths[id];
        const selected = path.selected || false;
        const included = selectedPathIds.includes(id);
        if (selected !== included) {
          update[id] = { ...path, selected: included };
        } else {
          update[id] = path;
        }
      });
      return { ...state, paths: update, selectedPathIds };
    }
    case Actions.DESELECT_ALL: {
      const update = {};
      state.pathIds.forEach(id => {
        const path = state.paths[id];
        if (path.selected) {
          update[id] = { ...path, selected: false };
        } else {
          update[id] = path;
        }
      });
      return { ...state, paths: update, selectedPathIds: [] };
    }
    case Actions.SELECT_TOOL: {
      return { ...state, activeTool: action.payload.tool };
    }
    default:
      return state;
  }
}, {
  undoType: GlobalActions.UNDO,
  redoType: GlobalActions.REDO,
  filter: excludeAction(Actions.SELECT_TOOL),
});
