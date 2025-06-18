// 批量重命名图片
export interface BatchRenameImagesOptions {
  images: string[];
  prefix: string;
  suffix: string;
  // 重命名后的图片路径，默认是 images[0] 的目录
  dir?: string;
}
