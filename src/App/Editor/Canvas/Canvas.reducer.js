import undoable, { excludeAction } from 'redux-undo';

import initialState from './Canvas.state';
import { Actions } from './Canvas.actions';
import { Actions as GlobalActions } from '../../../shared/actions';

function updatePaths(state, action) {
  const { payload } = action;
  if (!payload.every(({ id }) => state.pathIds.includes(id))) {
    return state;
  }
  let { paths, selectedPathIds } = state;
  payload.forEach(path => {
    const { id } = path;
    paths = {
      ...paths,
      [id]: {
        ...paths[id],
        ...path,
      },
    };
    if (paths[id].selected) {
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
  });
  return { ...state, paths, selectedPathIds };
}

function deselectAll(state) {
  const update = {};
  const { paths } = state;
  state.selectedPathIds.forEach(id => {
    const path = paths[id];
    update[id] = { ...path, selected: false };
  });
  return { ...state, paths: { ...paths, ...update }, selectedPathIds: [] };
}

export default undoable((state = initialState, action) => {
  switch (action.type) {
    case Actions.ADD_PATH: {
      const { payload } = action;
      const { id, selected } = payload;
      const { paths, pathIds, selectedPathIds, layers, activeLayer } = state;
      const { pathIds: layerPathIds, ...layer } = layers[activeLayer];
      return {
        ...state,
        paths: {
          ...paths,
          [id]: {
            layer: activeLayer,
            ...payload,
          },
        },
        pathIds: pathIds.concat(id),
        selectedPathIds: selected ? selectedPathIds.concat(id) : selectedPathIds,
        layers: {
          ...layers,
          [activeLayer]: {
            ...layer,
            pathIds: layerPathIds.concat(id),
          },
        },
      };
    }
    case Actions.REMOVE_PATHS: {
      const { ids } = action.payload;
      let { paths, pathIds, selectedPathIds, layers } = state;
      pathIds = pathIds.filter(pathId => !ids.includes(pathId));
      paths = pathIds.reduce((rest, id) => ({ ...rest, [id]: paths[id] }), {});
      selectedPathIds = selectedPathIds.filter(pathId => !ids.includes(pathId));
      layers = state.layerIds.reduce((rest, id) => ({
        ...rest, [id]: { ...layers[id], pathIds: pathIds.filter(pathId => !ids.includes(pathId)) },
      }));
      return { ...state, paths, pathIds, selectedPathIds };
    }
    case Actions.UPDATE_PATHS: return updatePaths(state, action);
    case Actions.SELECT_PATH: return updatePaths(
      deselectAll(state),
      { ...action, payload: [{ ...action.payload, selected: true }] },
    );
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
    case Actions.DESELECT_ALL: return deselectAll(state);
    case Actions.ADD_LAYER: {
      const { layerIds, layers } = state;
      const { id } = action.payload;
      return {
        ...state,
        layers: {
          ...layers,
          [id]: action.payload,
        },
        layerIds: layerIds.concat(id),
        activeLayer: id,
      };
    }
    case Actions.REMOVE_LAYERS: {
      const { ids } = action.payload;
      let { layers, layerIds, activeLayer } = state;
      layerIds = layerIds.filter(layerId => !ids.includes(layerId));
      layers = layerIds.reduce((rest, id) => ({ ...rest, [id]: layers[id] }), {});
      activeLayer = ids.includes(activeLayer) ? layerIds[layerIds.length - 1] : activeLayer;
      return { ...state, layers, layerIds, activeLayer };
    }
    case Actions.SELECT_LAYER: return { ...state, activeLayer: action.payload.id };
    case Actions.SELECT_TOOL: return { ...state, activeTool: action.payload.tool };
    default: return state;
  }
}, {
  undoType: GlobalActions.UNDO,
  redoType: GlobalActions.REDO,
  filter: excludeAction([Actions.SELECT_LAYER, Actions.SELECT_TOOL]),
});
