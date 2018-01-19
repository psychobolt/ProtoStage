export const getApp = state => state.app || {};

export const getEditor = state => getApp(state).editor || {};

export const getProject = state => getApp(state).project || {};

export const getProjectHistory = state => getProject(state).history || {};

export const getProjectWithoutHistory = state => {
  const { history, ...rest } = getProject(state);
  return rest;
};

export const getPastProject = state => getProjectHistory(state).past || {};

export const getPresentProject = state => getProjectHistory(state).present || {};

export const getFutureProject = state => getProjectHistory(state).future || {};

export const getProjectCanvas = state => getPresentProject(state).canvas || {};

export const getWorldProject = state => getPresentProject(state).world || {};

export const getCanvasProject = state => getProject(state).config || {};

export const getSettings = state => getProject(state).settings || {};

export const getCanvasSettings = state => getSettings(state).canvas || {};

export const getWorldSettings = state => getSettings(state).world || {};

export const getWorkspace = state => ({
  ...getProjectWithoutHistory(state),
  project: getPresentProject(state),
});

export const getCanvas = state => ({
  ...getEditor(state).canvas,
  ...getProjectCanvas(state),
  ...getCanvasSettings(state),
});

export const getWorld = state => ({
  ...getEditor(state).world,
  ...getWorldProject(state),
  ...getWorldSettings(state),
});
