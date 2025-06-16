/// <reference types="vite-plugin-electron/electron-env" />
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}
interface ElectronAPI {
  selectImage: () => Promise<{ path: string; base64: string } | null>;
  saveImage: (defaultPath: string) => Promise<string | null>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
}
// Used in Renderer process, expose in `preload.ts`
interface Window {
  electronAPI: {
    getAppVersion: () => Promise<string>,
    selectFolder: () => Promise<string>,
    selectImages: () => Promise<string[]>,
    batchRenameImages: (params: { 
      images: string[], 
      targetDir: string, 
      namePattern: string 
    }) => Promise<{
      success: boolean,
      results?: Array<{
        original: string,
        newPath: string
      }>,
      error?: string
    }>,
    getImagePath: () => Promise<string>
  }
}
