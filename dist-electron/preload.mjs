"use strict";
const electron = require("electron");
const publicAPI = {
  selectImage: async () => {
    return electron.ipcRenderer.invoke("dialog:selectImage");
  },
  batchRenameImages: async (options) => {
    return electron.ipcRenderer.invoke("batch-rename-images", options);
  }
};
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  ...publicAPI
});
