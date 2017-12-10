export const Actions = {
  ADD_PATH: 'addPath',
  UPDATE_PATH: 'updatePath',
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
