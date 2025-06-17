export interface RenameImageParams {
    images: string[], 
    targetDir: string, 
    namePattern: string 
}


export interface ElectronAPIs {
  getAppVersion: () => Promise<string>,
  selectFolder: () => Promise<string>,
  selectImages: () => Promise<string[]>,
  batchRenameImages: (params: RenameImageParams) => Promise<{
    success: boolean,
    results?: Array<{
      original: string,
      newPath: string
    }>,
    error?: string
  }>,
  getImagePath: () => Promise<string>
}