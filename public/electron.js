const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs').promises;
const Store = require('electron-store');

// Prova ad importare ssh2-promise, se non disponibile usa simulazione
let SSH2Promise;
let sshAvailable = false;
try {
  SSH2Promise = require('ssh2-promise');
  sshAvailable = true;
  console.log('SSH2Promise loaded successfully');
} catch (err) {
  console.log('SSH2Promise not available, SSH will be simulated');
}

const store = new Store();

let mainWindow;
let sshConnection = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1400,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 20, y: 20 },
    transparent: false,
    frame: process.platform !== 'darwin',
    hasShadow: true,
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Create menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-project');
          }
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled && result.filePaths[0]) {
              mainWindow.webContents.send('menu-open-project', result.filePaths[0]);
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu-save-as');
          }
        },
        { type: 'separator' },
        {
          label: 'Export as HTML',
          click: () => {
            mainWindow.webContents.send('menu-export-html');
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About SMABITS Editor',
              message: 'SMABITS Editor',
              detail: 'Version 1.0.0\nA professional shortcode editor for LaTeX documents.',
              buttons: ['OK']
            });
          }
        },
        {
          label: 'Documentation',
          click: () => {
            require('electron').shell.openExternal('https://github.com/yourusername/smabits-editor');
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: 'About ' + app.getName(), role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    if (sshConnection) {
      try {
        sshConnection.close();
      } catch (err) {
        console.log('Error closing SSH connection:', err);
      }
      sshConnection = null;
    }
    mainWindow = null;
  });
}

// ===== REGISTRA GLI IPC HANDLERS =====
// Store handlers
ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
});

// File handlers
ipcMain.handle('save-file', async (event, { path: filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Dialog handlers
ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

// ===== SSH HANDLERS =====
ipcMain.handle('ssh-connect', async (event, config) => {
  console.log('SSH connect handler called with:', config);
  
  try {
    // Se ssh2-promise non è disponibile, ritorna errore
    if (!sshAvailable || !SSH2Promise) {
      return {
        success: false,
        error: 'SSH module not installed. Please enable simulation mode or run: npm install ssh2-promise'
      };
    }

    // Se c'è già una connessione, chiudila
    if (sshConnection) {
      try {
        await sshConnection.close();
      } catch (err) {
        console.log('Error closing existing connection:', err);
      }
      sshConnection = null;
    }

    // Crea nuova connessione
    sshConnection = new SSH2Promise({
      host: config.host,
      port: parseInt(config.port) || 22,
      username: config.username,
      password: config.password,
      readyTimeout: 10000,
      reconnect: false,
      reconnectTries: 1,
      reconnectDelay: 5000
    });

    // Connetti
    await sshConnection.connect();
    console.log('SSH connection established');
    
    // Ottieni informazioni del sistema
    let systemInfo = '';
    try {
      systemInfo = await sshConnection.exec('uname -a && echo "---" && whoami && echo "---" && pwd && echo "---" && date');
    } catch (err) {
      console.log('Error getting system info:', err);
      systemInfo = 'Connected successfully';
    }
    
    return {
      success: true,
      message: 'Connesso con successo',
      systemInfo: systemInfo
    };
  } catch (error) {
    console.error('SSH connection error:', error);
    return {
      success: false,
      error: error.message || 'Errore di connessione SSH'
    };
  }
});

ipcMain.handle('ssh-disconnect', async () => {
  console.log('SSH disconnect handler called');
  try {
    if (sshConnection) {
      await sshConnection.close();
      sshConnection = null;
    }
    return { success: true };
  } catch (error) {
    console.error('SSH disconnect error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ssh-execute', async (event, command) => {
  console.log('SSH execute handler called with command:', command);
  try {
    if (!sshConnection) {
      return { success: false, error: 'Nessuna connessione SSH attiva' };
    }
    
    const result = await sshConnection.exec(command);
    return { success: true, output: result };
  } catch (error) {
    console.error('SSH execute error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ssh-check-connection', async () => {
  return { connected: sshConnection !== null };
});

console.log('SSH handlers registered');

// ===== APP LIFECYCLE =====
app.whenReady().then(() => {
  createWindow();
  console.log('App is ready, window created');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});