import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  nativeTheme.themeSource = 'light'
  BrowserWindow.addDevToolsExtension('node_modules/vue-devtools/vender')

  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

let addFileWindow
ipcMain.on('add-file', function() {
  addFileWindow = new BrowserWindow({
    width: 1000, 
    height: 563,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })
  addFileWindow.loadURL(winURL + '#/AddFile'); //new.html是新开窗口的渲染进程
  addFileWindow.on('closed',()=>{addFileWindow = null})
})

let editTagWindow
ipcMain.on('edit-tag', function() {
  editTagWindow = new BrowserWindow({
    width: 1000, 
    height: 563,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })
  editTagWindow.loadURL(winURL + '#/EditTag')
  editTagWindow.on('closed', () => {editTagWindow = null})
})
