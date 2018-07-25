import Hashids from 'hashids';

export const Actions = {
  ADD_PATH: 'addPath',
  REMOVE_PATHS: 'removePaths',
  UPDATE_PATHS: 'updatePaths',
  SELECT_PATHS: 'selectPaths',
  DESELECT_ALL: 'deselectAll',
  ADD_LAYER: 'addLayer',
  REMOVE_LAYERS: 'removeLayers',
  LINK_LAYER: 'linkLayer',
  LINK_PATH: 'linkPath',
  SELECT_LAYER: 'selectLayer',
  SELECT_TOOL: 'selectTool',
  SET_GRID_SPACING: 'setGridSpacing',
  TOGGLE_AUTO_SYNC: 'toggleAutoSync',
  ZOOM: 'zoom',
};

export const addPath = (path, skipHistory) => ({
  type: Actions.ADD_PATH,
  payload: {
    id: new Hashids('path').encode(new Date().getTime()),
    ...path,
  },
  meta: { skipHistory },
});

export const linkPath = (id, links) => ({
  type: Actions.LINK_PATH, payload: { id, links }, meta: { skipHistory: true },
});

export const removePaths = (ids, skipHistory) => ({
  type: Actions.REMOVE_PATHS, payload: { ids }, meta: { skipHistory },
});

export const updatePaths = payload => ({
  type: Actions.UPDATE_PATHS, payload,
});

export const selectPaths = (ids, skipHistory) => ({
  type: Actions.SELECT_PATHS, payload: { ids }, meta: { skipHistory },
});

export const deselectAll = skipHistory => ({ type: Actions.DESELECT_ALL, meta: { skipHistory } });

export const addLayer = skipHistory => ({
  type: Actions.ADD_LAYER,
  payload: {
    id: new Hashids('layer').encode(new Date().getTime()),
    pathIds: [],
  },
  meta: { skipHistory },
});

export const removeLayers = ids => ({ type: Actions.REMOVE_LAYERS, payload: { ids } });

export const linkLayer = (id, links) => ({
  type: Actions.LINK_LAYER, payload: { id, links }, meta: { skipHistory: true },
});

export const selectLayer = id => ({
  type: Actions.SELECT_LAYER, payload: { id }, meta: { skipHistory: true },
});

export const selectTool = tool => ({
  type: Actions.SELECT_TOOL, payload: { tool }, meta: { skipHistory: true },
});

export const setGridSpacing = spacing => ({
  type: Actions.SET_GRID_SPACING, payload: { spacing },
});

export const toggleAutoSync = () => ({ type: Actions.TOGGLE_AUTO_SYNC });

export const zoom = level => ({ type: Actions.ZOOM, payload: { level } });
