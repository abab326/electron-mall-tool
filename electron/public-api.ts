import { ipcRenderer } from 'electron';
import { BatchRenameImagesOptions } from './types/api';

export const publicAPI = {
  selectImage: async () => {
    return ipcRenderer.invoke('dialog:selectImage');
  },
  batchRenameImages: async (options: BatchRenameImagesOptions) => {
    return ipcRenderer.invoke('batch-rename-images', options);
  },
};
