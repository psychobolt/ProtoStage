import { Menu } from 'electron';

import { undo, redo } from './shared/actions';

function canUndo(state) {
  return state.editor.canvas.past.length > 0;
}

function canRedo(state) {
  return state.editor.canvas.future.length > 0;
}

export default (win, store) => {
  let state = store.getState();

  const editMenu = () => ({
    role: 'editMenu',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        click: () => store.dispatch(undo()),
        enabled: canUndo(state),
      },
      {
        label: 'Redo',
        accelerator: 'CommandOrControl+Y',
        click: () => store.dispatch(redo()),
        enabled: canRedo(state),
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

  const menu = Menu.buildFromTemplate([
    editMenu(),
    viewMenu(),
    ...(process.env.NODE_ENV === 'development' ? [goMenu()] : []),
    { role: 'windowMenu' },
  ]);

  const [undoItem, redoItem] = menu.items[0].submenu.items;
  store.subscribe(() => {
    state = store.getState();
    undoItem.enabled = canUndo(state);
    redoItem.enabled = canRedo(state);
  });

  return menu;
};
