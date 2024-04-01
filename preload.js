const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

contextBridge.exposeInMainWorld('electronAPI', {
    selectTXT: () => ipcRenderer.invoke('dialog:openTXT'),
    selectOutputDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    startProcessing: (data) => ipcRenderer.send('process:start', data),
    onProgressUpdate: (callback) => ipcRenderer.on('process:progress', callback),
    onComplete: (callback) => ipcRenderer.on('process:complete', callback),
    hasCredentials: () => store.has('awsCredentials'),
    saveCredentials: (credentials) => store.set('awsCredentials', credentials),
    getCredentials: () => store.get('awsCredentials'),
    updateCredentials: (credentials) => ipcRenderer.send('credentials:update', credentials),
    setTimestampSetting: (value) => store.set('appendTimestamp', value),
    getTimestampSetting: () => store.get('appendTimestamp', true),
    onError: (callback) => ipcRenderer.on('process:error', callback),
    logMessage: (message) => ipcRenderer.send('log-message', message)
});
