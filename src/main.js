const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    let win = new BrowserWindow({
        width: 1400, 
        height: 1000,
        webPreferences: { nodeIntegration: true }
    })
    win.loadFile('src/index.html');
    //win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.quit();
})