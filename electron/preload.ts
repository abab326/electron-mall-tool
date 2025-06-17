import { contextBridge } from 'electron';
import { publicAPI } from './public-api';
// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  ...publicAPI,
});
