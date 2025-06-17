var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ipcMain, dialog, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import path from "path";
import fs from "fs";
class IpcManager {
  constructor() {
    // 为了解决类型错误，在类中声明 handlers 属性
    __publicField(this, "handlers");
    this.handlers = {
      "dialog:selectImage": this.handleSelectImage,
      "batch-rename-images": this.handleBatchRenameImages
    };
  }
  initialize() {
    Object.entries(this.handlers).forEach(([channel, handler]) => {
      ipcMain.handle(channel, handler.bind(this));
    });
  }
  getMimeType(path2) {
    var _a;
    const ext = ((_a = path2.split(".").pop()) == null ? void 0 : _a.toLowerCase()) ?? "jpg";
    const types = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp"
    };
    return types[ext] || "image/jpeg";
  }
  async handleSelectImage() {
    const result = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif", "jpeg"] }]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths.map((item) => {
        const data = fs.readFileSync(item);
        const mimeType = this.getMimeType(item);
        return {
          id: Date.now().toString(),
          path: item,
          name: path.basename(item),
          url: `data:${mimeType};base64,${data.toString("base64")}`
        };
      });
    }
    return null;
  }
  // 批量重命名图片到指定目录
  async handleBatchRenameImages(event, options) {
    if (!options.images || options.images.length === 0) {
      return;
    }
    const dir = path.dirname(options.images[0]);
    const uploadDir = path.join(dir, "upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    options.images.forEach((image, index) => {
      path.basename(image);
      const imageExt = path.extname(image);
      const newImageName = `${options.prefix}-${options.suffix}-${index + 1}${imageExt}`;
      const newImagePath = path.join(uploadDir, newImageName);
      fs.copyFileSync(image, newImagePath);
    });
  }
}
createRequire(import.meta.url);
const __dirname = path$1.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$1.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  const ipcManager = new IpcManager();
  ipcManager.initialize();
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname, "preload.mjs"),
      devTools: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    console.log("url", VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
