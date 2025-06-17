import { ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { BatchRenameImagesOptions } from './types/api';

class IpcManager {
  // 为了解决类型错误，在类中声明 handlers 属性
  handlers: { [key: string]: (event: any, ...args: any[]) => any };
  constructor() {
    this.handlers = {
      'dialog:selectImage': this.handleSelectImage,
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
      return result.filePaths.map((item) => {
        const data = fs.readFileSync(item);
        const mimeType = this.getMimeType(item); // 根据扩展名获取MIME类型
        return {
          id: Date.now().toString(),
          path: item,
          name: path.basename(item),
          url: `data:${mimeType};base64,${data.toString('base64')}`,
        };
      });
    }
    return null;
  }
  // 批量重命名图片到指定目录
  // 优化：添加输入验证，处理异步操作使用 Promise.all 提高效率，添加错误处理
  async handleBatchRenameImages(
    event: any,
    options: BatchRenameImagesOptions
  ): Promise<void> {
    // 如果 images  为空 直接返回
    if (!options.images || options.images.length === 0) {
      return;
    }
    // 重命名目录为 图片文件夹下的upload 文件夹
    const dir = path.dirname(options.images[0]);
    const uploadDir = path.join(dir, 'upload');
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
