const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  const display = electron.screen.getPrimaryDisplay()

  let width = Math.floor(display.workAreaSize.width * 0.7)
  let height = Math.floor(display.workAreaSize.height * 0.9)

  if (width > 1440) width = 1440
  if (height > 900) height = 900

  const iconfiletype = process.platform == 'win32' ? 'ico' : 'png'
  const icon = path.resolve(__dirname, `icon.{iconfiletype}`)

  mainWindow = new BrowserWindow({ width: 800, height: 600, icon: icon, frame: false, resizable: false })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
