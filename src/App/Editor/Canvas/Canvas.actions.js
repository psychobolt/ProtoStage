export const Actions = {
  ADD_PATH: 'addPath',
  REMOVE_PATHS: 'removePaths',
  UPDATE_PATH: 'updatePath',
  SELECT_PATHS: 'selectPaths',
  DESELECT_ALL: 'deselectAll',
  SELECT_TOOL: 'selectTool',
};

let nextPathId = 0;

export const addPath = path => ({
  type: Actions.ADD_PATH,
  payload: {
    id: nextPathId++, // eslint-disable-line no-plusplus
    ...path,
  },
});

export const removePaths = ids => ({ type: Actions.REMOVE_PATHS, payload: { ids } });

export const updatePath = payload => ({ type: Actions.UPDATE_PATH, payload });

export const selectPaths = selectedPathIds =>
  ({ type: Actions.SELECT_PATHS, payload: { selectedPathIds } });

export const deselectAll = () => ({ type: Actions.DESELECT_ALL });

export const selectTool = tool => ({ type: Actions.SELECT_TOOL, payload: { tool } });
