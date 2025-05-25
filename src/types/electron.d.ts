interface FileSystemResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modifiedAt?: string;
}

export interface DriveInfo {
  name: string;
  path: string;
  total: string;
  free: string;
  used: string;
  usedPercentage: string;
}

export interface FileSystemAPI {
  listDirectory: (path: string) => Promise<FileSystemItem[]>;
  createFolder: (path: string) => Promise<void>;
  deleteItem: (path: string) => Promise<void>;
  copyItem: (source: string, destination: string) => Promise<void>;
  getDrives: () => Promise<DriveInfo[]>;
}

export interface NavigationAPI {
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  loadURL: (url: string) => void;
}

export interface SystemAPI {
  platform: string;
  homedir: string;
}

export interface ElectronAPI {
  fileSystem: FileSystemAPI;
  navigation: NavigationAPI;
  system: SystemAPI;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};