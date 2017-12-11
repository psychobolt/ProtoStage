export const Actions = {
  ADD_PATH: 'addPath',
  UPDATE_PATH: 'updatePath',
  SELECT_PATHS: 'selectPaths',
  DESELECT_ALL: 'deselectAll',
};

let nextPathId = 0;

export const addPath = path => ({
  type: Actions.ADD_PATH,
  payload: {
    id: nextPathId++, // eslint-disable-line no-plusplus
    ...path,
  },
});

export const updatePath = payload => ({ type: Actions.UPDATE_PATH, payload });

export const selectPaths = selectedPathIds =>
  ({ type: Actions.SELECT_PATHS, payload: { selectedPathIds } });

export const deselectAll = () => ({ type: Actions.DESELECT_ALL });
