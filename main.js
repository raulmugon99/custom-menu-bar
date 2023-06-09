// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/custom-menu-bar/index.html`),
        protocol: "file:",
        slashes: true
      })
    )
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algunas APIs pueden solamente ser usadas despues de que este evento ocurra.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Tu también puedes ponerlos en archivos separados y requerirlos aquí.

//Move the main window to the position pass
ipcMain.on('move-window', (event, x, y) => {
  mainWindow.setPosition(x, y);
});

//Pass bounds data to angular
ipcMain.handle('getBounds', () => {
  return mainWindow.getBounds(); // Retorna el valor de vuelta para que pueda ser usado en el proceso de renderizado de Angular
});

//toggle maximize on main window
ipcMain.on('toggle-window-maximize', () => {
  if ( mainWindow.isMaximized() ) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

//close the app
ipcMain.on('close', () => {
  app.quit();
})

//Minimize the main window
ipcMain.on('minimize', () => {
  mainWindow.minimize();
})