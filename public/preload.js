const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations
  getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
  setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  
  // File operations
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // SSH operations
  sshConnect: (config) => ipcRenderer.invoke('ssh-connect', config),
  sshDisconnect: () => ipcRenderer.invoke('ssh-disconnect'),
  sshExecute: (command) => ipcRenderer.invoke('ssh-execute', command),
  sshCheckConnection: () => ipcRenderer.invoke('ssh-check-connection'),
  
  // Menu events
  onMenuAction: (callback) => {
    const events = [
      'menu-new-project',
      'menu-open-project',
      'menu-save',
      'menu-save-as',
      'menu-export-html'
    ];
    
    events.forEach(event => {
      ipcRenderer.on(event, (_, data) => callback(event, data));
    });
  },
  
  // Remove listeners
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners();
  }
});