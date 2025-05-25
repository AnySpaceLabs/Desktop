const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const FileSystemService = require('./services/fileSystem');
const os = require('os');

const appServe = app.isPackaged ? serve({
  directory: path.join(__dirname, "../out")
}) : null;

let mainWindow = null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      webSecurity: true,
      sandbox: false
    }
  });

  mainWindow = win;

  // Set CSP headers
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          process.env.NODE_ENV === 'development'
            ? `default-src * data: blob: filesystem: about: ws: wss: 'unsafe-inline' 'unsafe-eval';
               script-src * data: blob: 'unsafe-inline' 'unsafe-eval';
               connect-src * data: blob: 'unsafe-inline';
               img-src * data: blob: 'unsafe-inline';
               frame-src * data: blob: ;
               style-src * data: blob: 'unsafe-inline';
               font-src * data: blob: 'unsafe-inline';
               media-src * data: blob: 'unsafe-inline';`
            : `default-src * data: blob: filesystem: about: ws: wss: 'unsafe-inline';
               script-src * data: blob: 'unsafe-inline';
               connect-src * data: blob: 'unsafe-inline';
               img-src * data: blob: 'unsafe-inline';
               frame-src * data: blob:;
               style-src * data: blob: 'unsafe-inline';
               font-src * data: blob: 'unsafe-inline';
               media-src * data: blob: 'unsafe-inline';`
        ]
      }
    });
  });

  // Configure session
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true); // Allow all permissions
  });

  // Handle certificate errors
  win.webContents.session.setCertificateVerifyProc((request, callback) => {
    // Accept all certificates in development
    callback(0); // 0 means success
  });

  // Configure webview permissions
  app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
      // Track the last error to prevent duplicates
      let lastError = {
        code: 0,
        url: '',
        timestamp: 0
      };

      // Helper to check if this is a duplicate error
      const isDuplicateError = (errorCode, url) => {
        const now = Date.now();
        const isDuplicate = (
          errorCode === lastError.code && 
          url === lastError.url && 
          (now - lastError.timestamp) < 1000
        );
        
        // Update last error
        lastError = {
          code: errorCode,
          url: url,
          timestamp: now
        };
        
        return isDuplicate;
      };

      // Handle certificate errors for webviews
      contents.session.setCertificateVerifyProc((request, callback) => {
        callback(0); // Accept all certificates
      });

      // Handle webview permission requests
      contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        callback(true);
      });

      // Handle new window creation
      contents.setWindowOpenHandler(({ url }) => {
        // Open links in the same webview
        contents.loadURL(url);
        return { action: 'deny' };
      });

      // Handle navigation errors
      contents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (!isMainFrame || !mainWindow) return;

        // Handle special error cases
        if (errorCode === -3) { // ERR_ABORTED
          // Only show ERR_ABORTED if it's not followed by another error
          setTimeout(() => {
            if (lastError.code === -3) {
              mainWindow.webContents.send('webview:error', {
                type: 'load',
                code: errorCode,
                description: errorDescription,
                url: validatedURL
              });
            }
          }, 100);
          return;
        }

        // Prevent duplicate errors
        if (isDuplicateError(errorCode, validatedURL)) return;

        // Send error to renderer
        mainWindow.webContents.send('webview:error', {
          type: 'load',
          code: errorCode,
          description: errorDescription,
          url: validatedURL
        });
      });

      // Handle provisional load failures
      contents.on('did-fail-provisional-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (!isMainFrame || !mainWindow) return;

        // For ERR_NAME_NOT_RESOLVED, we want to show this error immediately
        if (errorCode === -105) {
          lastError = {
            code: errorCode,
            url: validatedURL,
            timestamp: Date.now()
          };
          
          mainWindow.webContents.send('webview:error', {
            type: 'provisional-load',
            code: errorCode,
            description: errorDescription,
            url: validatedURL
          });
          return;
        }

        // For other errors, prevent duplicates
        if (isDuplicateError(errorCode, validatedURL)) return;

        mainWindow.webContents.send('webview:error', {
          type: 'provisional-load',
          code: errorCode,
          description: errorDescription,
          url: validatedURL
        });
      });

      // Prevent navigation to unallowed protocols
      contents.on('will-navigate', (event, url) => {
        const protocol = new URL(url).protocol;
        if (!['http:', 'https:'].includes(protocol)) {
          event.preventDefault();
          if (mainWindow) {
            mainWindow.webContents.send('webview:error', {
              type: 'navigation',
              code: -501,
              description: 'Navigation to non-HTTP protocol blocked',
              url: url
            });
          }
        }
      });

      // Handle certificate errors directly on the webview
      contents.on('certificate-error', (event, url, error, certificate, callback) => {
        event.preventDefault();
        if (mainWindow) {
          mainWindow.webContents.send('webview:error', {
            type: 'certificate',
            code: -137,
            description: `SSL Certificate Error: ${error}`,
            url: url
          });
        }
        callback(false); // Don't accept invalid certificates
      });

      contents.on('render-process-gone', (event, details) => {
        if (mainWindow) {
          mainWindow.webContents.send('webview:error', {
            type: 'crash',
            code: -1000,
            description: `Webview process ${details.reason}`,
            url: contents.getURL()
          });
        }
      });

      contents.on('unresponsive', () => {
        if (mainWindow) {
          mainWindow.webContents.send('webview:error', {
            type: 'unresponsive',
            code: -1001,
            description: 'Webview became unresponsive',
            url: contents.getURL()
          });
        }
      });
    }
  });

  // Show window when ready to avoid flickering
  win.once('ready-to-show', () => {
    win.show();
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
}

app.on("ready", () => {
    // Initialize FileSystemService
    new FileSystemService(); // This will register the IPC handlers in its constructor
    
    createWindow();
    setupIpcHandlers();
});

// Set up IPC handlers for navigation
function setupIpcHandlers() {
  // Handle navigation events
  ipcMain.on('navigation:back', () => {
    if (mainWindow && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
  });
  
  ipcMain.on('navigation:forward', () => {
    if (mainWindow && mainWindow.webContents.canGoForward()) {
      mainWindow.webContents.goForward();
    }
  });
  
  ipcMain.on('navigation:refresh', () => {
    if (mainWindow) {
      mainWindow.webContents.reload();
    }
  });
  
  ipcMain.on('navigation:load-url', (event, url) => {
    if (mainWindow) {
      // Validate URL before loading
      if (url.startsWith('http://') || url.startsWith('https://')) {
        mainWindow.webContents.loadURL(url);
      }
    }
  });

  // Set up error handling for the main window
  if (mainWindow) {
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      // Only handle main frame errors
      if (isMainFrame) {
        mainWindow.webContents.send('main:error', {
          type: 'load',
          code: errorCode,
          description: errorDescription,
          url: validatedURL
        });
      }
    });

    mainWindow.webContents.on('did-fail-provisional-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (isMainFrame) {
        mainWindow.webContents.send('main:error', {
          type: 'provisional-load',
          code: errorCode,
          description: errorDescription,
          url: validatedURL
        });
      }
    });

    mainWindow.webContents.on('render-process-gone', (event, details) => {
      mainWindow.webContents.send('main:error', {
        type: 'crash',
        code: -1000,
        description: `Renderer process ${details.reason}`,
        url: mainWindow.webContents.getURL()
      });
    });

    mainWindow.webContents.on('unresponsive', () => {
      mainWindow.webContents.send('main:error', {
        type: 'unresponsive',
        code: -1001,
        description: 'Page became unresponsive',
        url: mainWindow.webContents.getURL()
      });
    });
  }
}

// Enable webview permissions
app.on('web-contents-created', (event, contents) => {
  // Handle webview errors
  contents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame && mainWindow) {
      mainWindow.webContents.send('webview:error', {
        type: 'load',
        code: errorCode,
        description: errorDescription,
        url: validatedURL
      });
    }
  });

  contents.on('did-fail-provisional-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame && mainWindow) {
      mainWindow.webContents.send('webview:error', {
        type: 'provisional-load',
        code: errorCode,
        description: errorDescription,
        url: validatedURL
      });
    }
  });

  contents.on('render-process-gone', (event, details) => {
    if (mainWindow) {
      mainWindow.webContents.send('webview:error', {
        type: 'crash',
        code: -1000,
        description: `Webview process ${details.reason}`,
        url: contents.getURL()
      });
    }
  });

  contents.on('unresponsive', () => {
    if (mainWindow) {
      mainWindow.webContents.send('webview:error', {
        type: 'unresponsive',
        code: -1001,
        description: 'Webview became unresponsive',
        url: contents.getURL()
      });
    }
  });

  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
    webPreferences.sandbox = true;
    
    // Prevent fullscreen behavior
    webPreferences.fullscreen = false;
    webPreferences.fullscreenable = false;
    
    // Additional security preferences
    webPreferences.allowRunningInsecureContent = false;
    webPreferences.experimentalFeatures = false;
    webPreferences.enableBlinkFeatures = '';
    webPreferences.spellcheck = false;
    
    // Verify URL being loaded
    if (!params.src.startsWith('https://') && !params.src.startsWith('http://')) {
      event.preventDefault();
    }
  });

  // Set CSP for webviews
  contents.session?.webRequest.onHeadersReceived((details, callback) => {
    const csp = app.isPackaged
      ? "default-src 'self' https: http:; script-src 'self' 'unsafe-inline' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; font-src 'self' data:;"
      : "default-src 'self' https: http: ws: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https: http:; connect-src 'self' ws: wss: https: http:; font-src 'self' data:; img-src 'self' data: https: http:;";

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp]
      }
    });
  });
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
}); 