import Hashids from 'hashids';

export const Actions = {
  NEW_PROJECT: 'newProject',
  FETCH_PROJECT: 'fetchProject',
  LOAD_PROJECT: 'loadProject',
};

export const newProject = () => ({
  type: Actions.NEW_PROJECT,
  payload: {
    id: new Hashids('project').encode(new Date().getTime()),
  },
});

export const fetchProject = id => ({ type: Actions.FETCH_PROJECT, payload: { id } });

export const loadProject = payload => ({ type: Actions.LOAD_PROJECT, payload });
