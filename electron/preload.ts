import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectImages: () => ipcRenderer.invoke('select-images'),
  batchRenameImages: (params:any) => ipcRenderer.invoke('batch-rename-images', params),
});
