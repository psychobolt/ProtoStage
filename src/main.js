import { app, BrowserWindow, Menu } from 'electron';
import { forwardToRenderer, replayActionMain } from 'electron-redux';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import url from 'url';

import reducer from './reducer';
import { getProject } from './App/App.selectors';
import { configureStore } from './shared/store';
import menu from './menu';

const store = configureStore(reducer, undefined, [forwardToRenderer]);

replayActionMain(store);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function installExtension() {
  const { default: install, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer'); // eslint-disable-line global-require
  const extensions = [REACT_DEVELOPER_TOOLS.id, REDUX_DEVTOOLS.id];
  return Promise.all(extensions.map(extension => install(extension)));
}

function renderMenu() {
  Menu.setApplicationMenu(menu(win, store));
}

async function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  // Create the browser window.
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
  });

  // then register listeners on window, so the state can be updated
  mainWindowState.manage(win);

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'production') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  } else {
    await installExtension();
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
    win.loadURL('http://localhost:3000/'); // TODO: pass port
  }

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  renderMenu();

  let prevState = store.getState();
  store.subscribe(() => {
    const state = store.getState();
    if (getProject(prevState).id !== getProject(state).id) {
      renderMenu();
    }
    prevState = state;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
