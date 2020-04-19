import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'
import fs from 'fs'

import store from '../renderer/store'

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
  // if (process.env.NODE_ENV === 'development') {
  //   BrowserWindow.addDevToolsExtension('node_modules/vue-devtools/vender')
  // }

  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.commandLine.appendSwitch("--disable-http-cache")

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

ipcMain.on('close-add-file', function() {
  addFileWindow.close()
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

let editRuleWindow
ipcMain.on('edit-rule', function() {
  editRuleWindow = new BrowserWindow({
    width: 1000, 
    height: 563,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })
  editRuleWindow.loadURL(winURL + '#/EditRule'); //new.html是新开窗口的渲染进程
  editRuleWindow.on('closed',()=>{editRuleWindow = null})
})

function findToken(url) {
  if (url.indexOf('access_token=') != -1) {
    return true
  }
  else {
    return false
  }
}

let loginWindow
ipcMain.on('login', function() {
  loginWindow = new BrowserWindow({
    width: 1000, 
    height: 563,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })
  loginWindow.loadURL('https://login.live.com/oauth20_authorize.srf?client_id=e690e338-e44d-4c11-ac03-0b2a96fa5fe7&scope=onedrive.readwrite%20offline_access&resource=https%3A%2F%2Fgraph.microsoft.com%2F&response_type=token&redirect_uri=https://login.live.com/oauth20_desktop.srf'); //new.html是新开窗口的渲染进程
  // loginWindow.loadURL('https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=https://login.live.com/oauth20_desktop.srf')
  loginWindow.webContents.on('will-navigate', function (event, newUrl) {
    console.log(newUrl);
    // More complex code to handle tokens goes here
  })
  loginWindow.webContents.on('did-stop-loading', function() {
    console.log(loginWindow.webContents.getURL())
    store.dispatch('urlChange', loginWindow.webContents.getURL())
    if (findToken(loginWindow.webContents.getURL())) {
      loginWindow.close()
    }
  })
  loginWindow.on('closed',()=>{loginWindow = null})
})

ipcMain.on('logout', function() {
  loginWindow = new BrowserWindow({
    width: 1000, 
    height: 563,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })
  loginWindow.loadURL('https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=https://login.live.com/oauth20_desktop.srf')
  loginWindow.webContents.on('did-stop-loading', function() {
    console.log(loginWindow.webContents.getURL())
  })
  loginWindow.on('closed',()=>{loginWindow = null})
})
