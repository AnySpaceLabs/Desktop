const { contextBridge, ipcRenderer } = require("electron");
const os = require('os');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
    // Standard IPC communication
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
    send: (channel, args) => {
        ipcRenderer.send(channel, args);
    },
    
    // Browser navigation helpers
    navigation: {
        goBack: () => ipcRenderer.send('navigation:back'),
        goForward: () => ipcRenderer.send('navigation:forward'),
        refresh: () => ipcRenderer.send('navigation:refresh'),
        loadURL: (url) => ipcRenderer.send('navigation:load-url', url)
    },
    
    // File system operations
    fileSystem: {
        listDirectory: (path) => ipcRenderer.invoke('fs:list-directory', path),
        createFolder: (path) => ipcRenderer.invoke('fs:create-folder', path),
        deleteItem: (path) => ipcRenderer.invoke('fs:delete', path),
        copyItem: (source, destination) => ipcRenderer.invoke('fs:copy', source, destination),
        getDrives: () => ipcRenderer.invoke('fs:get-drives')
    },

    // System information
    system: {
        platform: process.platform,
        homedir: os.homedir()
    }
}); 