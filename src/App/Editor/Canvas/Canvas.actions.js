export const Actions = {
  ADD_PATH: 'addPath',
};

let nextPathId = 0;

export const addPath = path => ({
  type: Actions.ADD_PATH,
  payload: {
    id: nextPathId++, // eslint-disable-line no-plusplus
    ...path,
  },
});
