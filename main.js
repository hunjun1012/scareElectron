// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const electron = require('electron')
const path = require('path');
const db = require('mariadb');
app.allowRendererProcessReuse = false;


//메인화면
function createWindow () {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;
    let position = [ width - 280, height - 270 ];
    const mainWindow = new BrowserWindow({
      x: position[0], y: position[1],
      frame: false,
      width: 280,
      height: 230,
      minWidth: 280,  
      minHeight: 230, 
      maxWidth: 280,
      maxHeight: 230,
      backgroundColor: '#F6F6F6',
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
      }
    })
    mainWindow.loadFile('index.html');
    // positioner.move('topRight');
    // mainWindow.webContents.openDevTools();
}

//공지사항
function createWindow2 () {
  // let position = [ 0, 0 ];
  const mainWindow = new BrowserWindow({
  // x: position[0], y: position[1],
    width: 500,
    height: 300,
    minWidth: 500,
    minHeight: 300, 
    maxWidth: 500,
    maxHeight: 300,
    backgroundColor: '#F6F6F6',
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  mainWindow.loadFile('posts.html');
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  createWindow2();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})