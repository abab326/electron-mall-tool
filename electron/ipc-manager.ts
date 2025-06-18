import { ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';

import { BatchRenameImagesOptions } from './types/api';

class IpcManager {
  // 为了解决类型错误，在类中声明 handlers 属性
  handlers: { [key: string]: (event: any, ...args: any[]) => any };
  constructor() {
    this.handlers = {
      'dialog:selectDir': this.handleSelectDir,
      'dialog:selectImage': this.handleSelectImage,
      'dialog:selectExcel': this.handleSelectExcel,
      'parse-excel': this.handleParseExcel,
      'batch-rename-images': this.handleBatchRenameImages,
    };
  }

  initialize() {
    Object.entries(this.handlers).forEach(([channel, handler]) => {
      ipcMain.handle(channel, handler.bind(this));
    });
  }
  getMimeType(path: string) {
    const ext = path.split('.').pop()?.toLowerCase() ?? 'jpg';
    const types: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return types[ext] || 'image/jpeg';
  }

  async handleSelectImage() {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return Promise.all(
        result.filePaths.map(async (item) => {
          // 处理图片文件
          const data = fs.readFileSync(item);
          const mimeType = this.getMimeType(item);
          return {
            id: Date.now().toString(),
            name: path.basename(item),
            url: `data:${mimeType};base64,${data.toString('base64')}`,
          };
        })
      );
    }
    return null;
  }
  // 选择Excel文件
  async handleSelectExcel() {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  }
  // 选择目录
  async handleSelectDir() {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  }
  // 解析Excel文件
  async handleParseExcel(event: any, filePath: string) {
    try {
      const data = fs.readFileSync(filePath);

      const workbook = XLSX.read(data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      console.log(jsonData);
    } catch (err) {
      console.error('解析失败:', err);
    }
  }
  // 批量重命名图片到指定目录
  async handleBatchRenameImages(
    event: any,
    options: BatchRenameImagesOptions
  ): Promise<void> {
    // 如果 images  为空 直接返回
    if (!options.images || options.images.length === 0) {
      return;
    }
    // 重命名目录为 图片文件夹下的upload 文件夹
    const dest = options.dir || path.dirname(options.images[0]);
    const uploadDir = path.join(dest, 'upload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    // 遍历图片数组
    options.images.forEach((image, index) => {
      // 图片名称
      const imageName = path.basename(image);
      // 图片后缀
      const imageExt = path.extname(image);
      // 新图片名称
      const newImageName = `${options.prefix}-${options.suffix}-${
        index + 1
      }${imageExt}`;
      // 新图片路径
      const newImagePath = path.join(uploadDir, newImageName);
      // 重命名图片
      fs.copyFileSync(image, newImagePath);
    });
  }
}

export default IpcManager;
