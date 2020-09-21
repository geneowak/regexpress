'use strict'

import { app, protocol, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { readFileSync, writeFileSync } from 'fs'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

ipcMain.on('visualizationAvailable', (event, args) => {
  
  const filename = dialog.showSaveDialogSync({
    title: 'Save RegExpress Visualization',
    defaultPath: 'file_name.png', // default file name
    buttonLabel: 'Save Visualization',
    filters: [
      {
        title: 'PNG',
        extensions: ['png']
      }
    ]
  })
  // if the user canceled then the filename will be undifined
  if (typeof filename === 'undefined') {
    return;
  }

  const pngData = args.png.replace(/^data:image\/png;base64,/, '')

  writeFileSync(filename, pngData, 'base64')
})

function openMatchesFile() {
  const selectedMatchFiles = dialog.showOpenDialogSync({
    title: 'Select your match file',
    filters: [
      {
        name: 'Text Files',
        extensions: ['txt', 'md'] 
      }
    ],
    properties: [
      'openFile' 
    ]
  });

  if (typeof selectedMatchFiles === 'undefined') {
    return
  }

  const selectedMatchFile = selectedMatchFiles.pop()
  
  const matchContent = readFileSync(selectedMatchFile).toString()
   
  win.webContents.send('matchFileSelected', {
    contents: matchContent,
  });
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 400,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

function saveVisualization() {
  win.webContents.send('saveVisualization');
}
function createMenu() {
  const menuTemplate = [
    { role: 'appMenu' },
    {
      label: 'File', 
      submenu: [
        {
          label: 'Open',
          accelerator: "CommandOrControl+O",
          click: openMatchesFile
        },
        {
          label: 'Save',
          accelerator: "CommandOrControl+S",
          click: saveVisualization
        }
      ]
    },
    {role: 'editMenu'}
  ]

  const menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  
  createMenu()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
