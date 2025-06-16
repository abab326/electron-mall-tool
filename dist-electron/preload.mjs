"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  selectFolder: () => electron.ipcRenderer.invoke("select-folder"),
  selectImages: () => electron.ipcRenderer.invoke("select-images"),
  batchRenameImages: (params) => electron.ipcRenderer.invoke("batch-rename-images", params)
});
