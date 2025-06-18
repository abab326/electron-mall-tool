import { ipcRenderer } from 'electron';
import { BatchRenameImagesOptions } from './types/api';

export const publicAPI = {
  // 选择图片
  selectImage: async () => {
    return ipcRenderer.invoke('dialog:selectImage');
  },
  // 选择Excel文件
  selectExcel: async () => {
    return ipcRenderer.invoke('dialog:selectExcel');
  },
  // 选择目录
  selectDir: async () => {
    return ipcRenderer.invoke('dialog:selectDir');
  },
  // 解析Excel文件
  parseExcel: async (filePath: string) => {
    return ipcRenderer.invoke('parse-excel', filePath);
  },
  // 批量重命名图片
  batchRenameImages: async (options: BatchRenameImagesOptions) => {
    return ipcRenderer.invoke('batch-rename-images', options);
  },
};
