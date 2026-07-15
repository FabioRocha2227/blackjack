import { app, BrowserWindow, session } from 'electron'
import { join } from 'node:path'

const devUrl = process.env.VITE_DEV_SERVER_URL
const isDev = Boolean(devUrl)
const contentSecurityPolicy = isDev && devUrl
  ? (() => {
      const devUrlObject = new URL(devUrl)
      const devConnectSrc = `${devUrlObject.protocol === 'https:' ? 'wss' : 'ws'}://${devUrlObject.host} ${devUrlObject.origin}`

      return [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        `connect-src 'self' ${devConnectSrc}`,
        "object-src 'none'",
        "base-uri 'self'",
      ].join('; ')
    })()
  : [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 980,
    minHeight: 720,
    backgroundColor: '#03140d',
    title: 'Blackjack',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  window.once('ready-to-show', () => {
    window.show()
    window.focus()
  })

  if (isDev) {
    window.loadURL(devUrl)
    window.webContents.openDevTools({ mode: 'detach' })
    return
  }

  window.loadFile(join(app.getAppPath(), 'dist', 'index.html'))
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [contentSecurityPolicy],
      },
    })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})