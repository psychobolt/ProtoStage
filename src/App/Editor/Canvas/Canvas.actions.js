export const Actions = {
  ADD_PATH: 'addPath',
  REMOVE_PATHS: 'removePaths',
  UPDATE_PATHS: 'updatePaths',
  SELECT_PATH: 'selectPath',
  SELECT_PATHS: 'selectPaths',
  DESELECT_ALL: 'deselectAll',
  ADD_LAYER: 'addLayer',
  REMOVE_LAYERS: 'removeLayer',
  SELECT_LAYER: 'selectLayer',
  SELECT_TOOL: 'selectTool',
};

let nextPathId = 0;
let nextLayerId = 0;

export const initialLayerId = nextLayerId;

export const addPath = path => ({
  type: Actions.ADD_PATH,
  payload: {
    id: nextPathId++, // eslint-disable-line no-plusplus
    ...path,
  },
});

export const removePaths = ids => ({ type: Actions.REMOVE_PATHS, payload: { ids } });

export const updatePaths = payload => ({ type: Actions.UPDATE_PATHS, payload });

export const selectPath = id => ({ type: Actions.SELECT_PATH, payload: { id } });

export const selectPaths = selectedPathIds =>
  ({ type: Actions.SELECT_PATHS, payload: { selectedPathIds } });

export const deselectAll = () => ({ type: Actions.DESELECT_ALL });

export const addLayer = () => ({
  type: Actions.ADD_LAYER,
  payload: {
    id: ++nextLayerId, // eslint-disable-line no-plusplus
    pathIds: [],
  },
});

export const removeLayers = ids => ({ type: Actions.REMOVE_LAYERS, payload: { ids } });

export const selectLayer = id => ({ type: Actions.SELECT_LAYER, payload: { id } });

export const selectTool = tool => ({ type: Actions.SELECT_TOOL, payload: { tool } });
