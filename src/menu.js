import { Menu, dialog } from 'electron';
import { push } from 'react-router-redux';
import fs from 'fs';

import { undo, redo } from './shared/actions';
import { loadProject } from './App/Project/Project.actions';
import { zoom, removePaths, linkPath } from './App/Editor/Canvas/Canvas.actions';
import { addBody, addFixtures, removeFixtures, togglePause, reset } from './App/Editor/World/World.actions';
import { getWorkspace, getCanvas, getProject, getPastProject, getFutureProject } from './App/App.selectors';

function add(num1, num2) {
  return ((num1 * 10) + (num2 * 10)) / 10;
}

function isProjectLoaded(state) {
  return typeof getProject(state).id !== 'undefined';
}

function canUndo(state) {
  return getPastProject(state).length > 0;
}

function canRedo(state) {
  return getFutureProject(state).length > 0;
}

function canZoomOut(state) {
  return getCanvas(state).zoomLevel > 0.1;
}

function canResetZoom(state) {
  return getCanvas(state).zoomLevel !== 1;
}

function haveSelectedPaths(state) {
  const { selectedPathIds } = getCanvas(state);
  return selectedPathIds && selectedPathIds.length > 0;
}

const fileFilters = [
  { name: 'ProtoStage Files', extensions: ['json'] },
  { name: 'All Files', extensions: ['*'] },
];

function loadWorkspace(store) {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: fileFilters,
  }, filenames => {
    if (filenames && filenames.length) {
      try {
        const data = fs.readFileSync(filenames[0]);
        const payload = JSON.parse(data);
        if (payload.id) {
          store.dispatch(loadProject(payload));
        }
      } catch (e) {
        // TODO handle error
      }
    }
  });
}

function saveProject(state) {
  dialog.showSaveDialog({
    filters: fileFilters,
  }, filename => filename && fs.writeFileSync(filename, JSON.stringify(getWorkspace(state))));
}

let unsubscribe;

export default (win, store) => {
  if (unsubscribe) unsubscribe();

  const { dispatch, subscribe, getState } = store;
  let state = getState();

  const fileMenu = () => ({
    label: 'File',
    submenu: [
      {
        label: 'Load Workspace',
        accelerator: 'CommandOrControl+O',
        click: () => loadWorkspace(store),
      },
      ...(isProjectLoaded(state) ? [
        {
          label: 'Save Workspace',
          accelerator: 'CommandOrControl+S',
          click: () => saveProject(getState()),
        },
        {
          label: 'Close Workspace',
          accelerator: 'Alt+X',
          click: () => dispatch(push('/')),
        },
      ] : []),
      { role: 'quit' },
    ],
  });

  const editMenu = () => ({
    role: 'editMenu',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        click: () => dispatch(undo()),
        enabled: canUndo(state),
      },
      {
        label: 'Redo',
        accelerator: 'CommandOrControl+Y',
        click: () => dispatch(redo()),
        enabled: canRedo(state),
      },
    ],
  });

  const canvasMenu = () => ({
    label: 'Canvas',
    submenu: [
      {
        label: 'Selection',
        type: 'submenu',
        submenu: [
          {
            label: 'Delete',
            click: () => dispatch(removePaths(getCanvas(getState()).selectedPathIds)),
            accelerator: 'Delete',
          },
          {
            label: 'Assign New Body',
            click: () => {
              const { selectedPathIds, pathLinks } = getCanvas(getState());
              let action = addBody(true);
              let fixtureIds = [];
              let fixtures = [];
              selectedPathIds.forEach(id => {
                const { fixtureId } = pathLinks[id];
                fixtureIds = fixtureIds.concat(fixtureId);
                fixtures = [...fixtures, { bodyId: action.payload.id, pathId: id }];
              });
              dispatch(removeFixtures(fixtureIds));
              dispatch(action);
              action = addFixtures(action.payload.id, fixtures, true);
              dispatch(action);
              action.payload.fixtures.forEach(fixture =>
                dispatch(linkPath(fixture.pathId, { fixtureId: fixture.id })));
            },
            accelerator: 'CommandOrControl+Shift+B',
          },
        ],
        enabled: haveSelectedPaths(state),
      },
      { type: 'separator' },
      {
        label: 'Zoom In',
        accelerator: 'CommandOrControl+=',
        click: () => dispatch(zoom(add(getCanvas(getState()).zoomLevel, 0.1))),
      },
      {
        label: 'Zoom Out',
        accelerator: 'CommandOrControl+-',
        click: () => {
          const { zoomLevel } = getCanvas(getState());
          if (zoomLevel > 0.1) dispatch(zoom(add(zoomLevel, -0.1)));
        },
        enabled: canZoomOut(state),
      },
      {
        label: 'Zoom Reset',
        accelerator: 'CommandOrControl+Backspace',
        click: () => dispatch(zoom(1)),
        enabled: canResetZoom(state),
      },
    ],
  });

  const sceneMenu = () => ({
    label: 'Scene',
    submenu: [
      {
        label: 'Toggle Pause',
        accelerator: 'P',
        click: () => dispatch(togglePause()),
      },
      {
        label: 'Reset',
        accelerator: 'Alt+R',
        click: () => dispatch(reset()),
      },
    ],
  });

  const viewMenu = () => ({
    label: 'View',
    submenu: [
      { role: 'togglefullscreen' },
      ...(process.env.NODE_ENV === 'development' ? [
        { role: 'reload' },
        { role: 'toggledevtools' },
      ] : []),
    ],
  });

  const goMenu = () => ({
    label: 'Go',
    submenu: [
      {
        label: 'Back',
        accelerator: 'Alt+Left',
        click: () => win.webContents.goBack(),
      },
      {
        label: 'Forward',
        accelerator: 'Alt+Right',
        click: () => win.webContents.goForward(),
      },
    ],
  });

  const { id: projectId } = getProject(state);

  const menu = Menu.buildFromTemplate([
    fileMenu(),
    ...(projectId ? [editMenu()] : []),
    ...(projectId ? [canvasMenu()] : []),
    ...(projectId ? [sceneMenu()] : []),
    viewMenu(),
    ...(process.env.NODE_ENV === 'development' ? [goMenu()] : []),
  ]);

  if (projectId) {
    const [
      fileMenuItem, // eslint-disable-line no-unused-vars
      editMenuItem,
      canvasMenuItem,
    ] = menu.items;
    const [undoItem, redoItem] = editMenuItem.submenu.items;
    const [
      selectionMenu,
      separator, // eslint-disable-line no-unused-vars
      zoomInItem, // eslint-disable-line no-unused-vars
      zoomOutItem,
      zoomResetItem,
    ] = canvasMenuItem.submenu.items;
    unsubscribe = subscribe(() => {
      state = getState();
      selectionMenu.enabled = haveSelectedPaths(state);
      undoItem.enabled = canUndo(state);
      redoItem.enabled = canRedo(state);
      zoomOutItem.enabled = canZoomOut(state);
      zoomResetItem.enabled = canResetZoom(state);
    });
  }

  return menu;
};
