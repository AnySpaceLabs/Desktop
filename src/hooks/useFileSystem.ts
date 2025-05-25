import { useState, useEffect, useCallback } from 'react';
import type { FileSystemItem, DriveInfo } from '@/types/electron';

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt?: Date;
}

interface UseFileSystemReturn {
  currentPath: string;
  files: FileItem[];
  drives: DriveInfo[];
  isLoading: boolean;
  error: string | null;
  navigate: (path: string) => void;
  navigateBack: () => void;
  createFolder: () => Promise<void>;
  deleteItems: (paths: string[]) => Promise<void>;
  copyItems: (paths: string[]) => Promise<void>;
  cutItems: (paths: string[]) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFileSystem(): UseFileSystemReturn {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [drives, setDrives] = useState<DriveInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  // Check if running in Electron
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsElectron(true);
      setCurrentPath(window.electronAPI.system.homedir);
    }
  }, []);

  const loadFiles = useCallback(async (path: string) => {
    if (!isElectron || !window.electronAPI) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading files from:', path);
      const items = await window.electronAPI.fileSystem.listDirectory(path);
      console.log('Loaded items:', items);
      setFiles(items.map((item: FileSystemItem) => ({
        name: item.name,
        path: item.path,
        type: item.isDirectory ? 'folder' : 'file',
        size: item.size,
        modifiedAt: item.modifiedAt ? new Date(item.modifiedAt) : undefined
      })));
    } catch (err) {
      console.error('Error loading files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [isElectron]);

  const loadDrives = useCallback(async () => {
    if (!isElectron || !window.electronAPI) return;

    try {
      console.log('Loading drives...');
      const loadedDrives = await window.electronAPI.fileSystem.getDrives();
      console.log('Loaded drives:', loadedDrives);
      setDrives(loadedDrives);
    } catch (err) {
      console.error('Error loading drives:', err);
      setError(err instanceof Error ? err.message : 'Failed to load drives');
      setDrives([]);
    }
  }, [isElectron]);

  // Load drives on mount
  useEffect(() => {
    if (isElectron) {
      loadDrives();
    }
  }, [isElectron, loadDrives]);

  // Load files when currentPath changes
  useEffect(() => {
    if (currentPath) {
      loadFiles(currentPath);
    }
  }, [currentPath, loadFiles]);

  const navigate = useCallback((path: string) => {
    console.log('Navigating to:', path);
    setCurrentPath(path);
  }, []);

  const navigateBack = useCallback(() => {
    if (!currentPath || !window.electronAPI) return;
    
    const sep = window.electronAPI.system.platform === 'win32' ? '\\' : '/';
    const parentPath = currentPath.split(sep).slice(0, -1).join(sep);
    
    if (parentPath) {
      console.log('Navigating back to:', parentPath);
      setCurrentPath(parentPath);
    }
  }, [currentPath]);

  const createFolder = useCallback(async () => {
    if (!isElectron || !window.electronAPI || !currentPath) return;

    const name = prompt('Enter folder name:');
    if (!name) return;

    try {
      const sep = window.electronAPI.system.platform === 'win32' ? '\\' : '/';
      const folderPath = `${currentPath}${sep}${name}`;
      console.log('Creating folder:', folderPath);
      await window.electronAPI.fileSystem.createFolder(folderPath);
      await loadFiles(currentPath);
    } catch (err) {
      console.error('Error creating folder:', err);
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    }
  }, [currentPath, isElectron, loadFiles]);

  const deleteItems = useCallback(async (paths: string[]) => {
    if (!isElectron || !window.electronAPI) return;

    try {
      console.log('Deleting items:', paths);
      await Promise.all(paths.map(path => 
        window.electronAPI!.fileSystem.deleteItem(path)
      ));
      await loadFiles(currentPath);
    } catch (err) {
      console.error('Error deleting items:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete items');
    }
  }, [currentPath, isElectron, loadFiles]);

  const copyItems = useCallback(async (paths: string[]) => {
    // TODO: Implement copy functionality
    console.log('Copy items:', paths);
  }, []);

  const cutItems = useCallback(async (paths: string[]) => {
    // TODO: Implement cut functionality
    console.log('Cut items:', paths);
  }, []);

  const refresh = useCallback(async () => {
    console.log('Refreshing current path:', currentPath);
    await loadFiles(currentPath);
  }, [currentPath, loadFiles]);

  return {
    currentPath,
    files,
    drives,
    isLoading,
    error,
    navigate,
    navigateBack,
    createFolder,
    deleteItems,
    copyItems,
    cutItems,
    refresh
  };
} 