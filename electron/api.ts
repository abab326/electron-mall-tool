import { ipcMain, dialog } from "electron";
import fs from "fs";
import path from "path";




export function setupElectronAPIs() {
  // 获取应用版本
  ipcMain.handle("get-app-version", () => {
    return process.env.npm_package_version;
  });

  // 选择文件夹
  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return result.filePaths[0];
  });

  // 多选图片
  ipcMain.handle("select-images", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif", "jpeg"] }],
    });
    return result.filePaths;
  });

  // 批量重命名图片到指定目录
  ipcMain.handle(
    "batch-rename-images",
    async (event, { images, targetDir, namePattern }) => {
      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const results = [];
        for (let i = 0; i < images.length; i++) {
          const ext = path.extname(images[i]);
          const newName = namePattern.replace("{index}", i + 1) + ext;
          const newPath = path.join(targetDir, newName);

          fs.copyFileSync(images[i], newPath);
          results.push({
            original: images[i],
            newPath: newPath,
          });
        }

        return { success: true, results };
      } catch (err) {
        // 由于 err 类型为 unknown，需要先判断是否为 Error 类型
        if (err instanceof Error) {
          return { success: false, error: err.message };
        } else {
          return { success: false, error: String(err) };
        }
      }
    }
  );
}
