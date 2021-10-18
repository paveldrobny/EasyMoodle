const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");



let mainWindow, updateWindow;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

const sendStatusToWindow = (text) => {
  log.info(text);

  ipcMain.on("window-update", (event) => {
    event.sender.send("message", text);
  });
};

function createWindow() {
  const size = {
    width: 860,
    height: 590,
  };

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minWidth: size.width,
    minHeight: size.height,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: true,
    },
  });
  //mainWindow.hide();
 // mainWindow.loadURL("https://paveldrobny.github.io/EasyMoodle/");
   mainWindow.loadFile("index.html");
   mainWindow.webContents.session.clearCache(() => {
  //   mainWindow.webContents.session.clearStorageData();
   });
  mainWindow.webContents.session.clearStorageData();
  mainWindow.webContents.reloadIgnoringCache();

  ipcMain.on("app-minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("app-maximize", () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });

  ipcMain.on("app-close", () => {
    mainWindow.close();
  });

  ipcMain.on("app-reload", () => {
    mainWindow.reload();
  });

  ipcMain.on("app-code", () => {
    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
  });
}

function createUpdater() {
  const size = {
    width: 300,
    height: 100,
  };

  updateWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minWidth: size.width,
    minHeight: size.height,
    maxWidth: size.width,
    maxHeight: size.height,
    resizable: false,
    movable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  updateWindow.loadFile("update.html");
}

app.whenReady().then(() => {
  log.info("starting update check");
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
  createUpdater();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// UPDATE EVENTS
autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
  mainWindow.show();
  updateWindow.close();
});

autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = `Downloaded: ${progressObj.percent.toFixed(1)}%`;
  sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
  autoUpdater.quitAndInstall();
});
