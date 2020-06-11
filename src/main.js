const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const electron = require("electron");
const ipc = electron.ipcMain;

const createWindow = () => {
  let win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: { nodeIntegration: true },
  });
  win.loadFile("src/index.html");
  //win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
};

ipc.on("lose", (event, arg) => {
  event.returnValue = "You Lose !";
});

ipc.on("Again", (event, arg) => {
  event.returnValue = "Play Again !";
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform === "darwin") app.quit();
});
