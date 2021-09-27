const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

let mainWindow, updateWindow;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

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

  // mainWindow.webContents.openDevTools();
  mainWindow.hide();
  mainWindow.loadFile("index.html");

  ipcMain.on("app-minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("app-maximize", () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });

  ipcMain.on("app-close", () => {
    mainWindow.close();
  });
}

function createUpdater() {
  const size = {
    width: 860,
    height: 590,
  };

  updateWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minWidth: size.width,
    minHeight: size.height,
    maxWidth: size.width,
    maxHeight: size.height,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
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

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send("message", text);
}

// UPDATE EVENTS
autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
});
