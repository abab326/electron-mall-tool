"use strict";
const electron = require("electron");
const publicAPI = {
  // 选择图片
  selectImage: async () => {
    return electron.ipcRenderer.invoke("dialog:selectImage");
  },
  // 选择Excel文件
  selectExcel: async () => {
    return electron.ipcRenderer.invoke("dialog:selectExcel");
  },
  // 选择目录
  selectDir: async () => {
    return electron.ipcRenderer.invoke("dialog:selectDir");
  },
  // 解析Excel文件
  parseExcel: async (filePath) => {
    return electron.ipcRenderer.invoke("parse-excel", filePath);
  },
  // 批量重命名图片
  batchRenameImages: async (options) => {
    return electron.ipcRenderer.invoke("batch-rename-images", options);
  }
};
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  ...publicAPI
});
