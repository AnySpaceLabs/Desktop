const { ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

class FileSystemService {
  constructor() {
    this.registerHandlers();
  }

  registerHandlers() {
    // Register all IPC handlers
    ipcMain.handle('fs:list-directory', async (_, dirPath) => {
      try {
        return await this.listDirectory(dirPath);
      } catch (err) {
        console.error('Error listing directory:', err);
        throw err;
      }
    });

    ipcMain.handle('fs:create-folder', async (_, folderPath) => {
      try {
        return await this.createFolder(folderPath);
      } catch (err) {
        console.error('Error creating folder:', err);
        throw err;
      }
    });

    ipcMain.handle('fs:delete', async (_, itemPath) => {
      try {
        return await this.deleteItem(itemPath);
      } catch (err) {
        console.error('Error deleting item:', err);
        throw err;
      }
    });

    ipcMain.handle('fs:copy', async (_, source, destination) => {
      try {
        return await this.copyItem(source, destination);
      } catch (err) {
        console.error('Error copying item:', err);
        throw err;
      }
    });

    ipcMain.handle('fs:get-drives', async () => {
      try {
        return await this.getDrives();
      } catch (err) {
        console.error('Error getting drives:', err);
        throw err;
      }
    });
  }

  async listDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const items = await Promise.all(entries.map(async (entry) => {
        const itemPath = path.join(dirPath, entry.name);
        let stats;
        try {
          stats = await fs.stat(itemPath);
        } catch (err) {
          console.error(`Error getting stats for ${itemPath}:`, err);
          return null;
        }

        return {
          name: entry.name,
          path: itemPath,
          isDirectory: entry.isDirectory(),
          size: entry.isDirectory() ? undefined : stats.size,
          modifiedAt: stats.mtime.toISOString()
        };
      }));

      return items.filter(Boolean);
    } catch (err) {
      console.error('Error listing directory:', err);
      throw err;
    }
  }

  async getDriveStats(drivePath) {
    try {
      if (process.platform === 'win32') {
        const output = execSync(`wmic logicaldisk where "DeviceID='${drivePath}'" get Size,FreeSpace /value`, { encoding: 'utf8' });
        const lines = output.trim().split('\n');
        const freeSpace = parseInt(lines[0].split('=')[1]);
        const totalSize = parseInt(lines[1].split('=')[1]);
        return {
          total: totalSize,
          free: freeSpace,
          used: totalSize - freeSpace,
          usedPercentage: ((totalSize - freeSpace) / totalSize * 100).toFixed(1)
        };
      } else {
        const output = execSync(`df -k "${drivePath}"`, { encoding: 'utf8' });
        const lines = output.trim().split('\n');
        const [, total, used, free] = lines[1].split(/\s+/);
        return {
          total: parseInt(total) * 1024,
          free: parseInt(free) * 1024,
          used: parseInt(used) * 1024,
          usedPercentage: (parseInt(used) / (parseInt(used) + parseInt(free)) * 100).toFixed(1)
        };
      }
    } catch (err) {
      console.error(`Error getting drive stats for ${drivePath}:`, err);
      return null;
    }
  }

  formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  async getDrives() {
    try {
      if (process.platform === 'win32') {
        // On Windows, list available drives
        const drives = [];
        for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
          const drivePath = `${letter}:`;
          try {
            await fs.access(`${drivePath}\\`);
            const stats = await this.getDriveStats(`${drivePath}`);
            if (stats) {
              drives.push({
                name: `${letter}:`,
                path: `${drivePath}\\`,
                total: this.formatBytes(stats.total),
                free: this.formatBytes(stats.free),
                used: this.formatBytes(stats.used),
                usedPercentage: stats.usedPercentage
              });
            }
          } catch {
            // Drive not available
            continue;
          }
        }
        return drives;
      } else {
        // On Unix-like systems, return root and home
        const rootStats = await this.getDriveStats('/');
        const homeStats = await this.getDriveStats(os.homedir());
        
        return [
          {
            name: 'Root',
            path: '/',
            total: this.formatBytes(rootStats.total),
            free: this.formatBytes(rootStats.free),
            used: this.formatBytes(rootStats.used),
            usedPercentage: rootStats.usedPercentage
          },
          {
            name: 'Home',
            path: os.homedir(),
            total: this.formatBytes(homeStats.total),
            free: this.formatBytes(homeStats.free),
            used: this.formatBytes(homeStats.used),
            usedPercentage: homeStats.usedPercentage
          }
        ];
      }
    } catch (err) {
      console.error('Error getting drives:', err);
      throw err;
    }
  }

  async createFolder(folderPath) {
    try {
      await fs.mkdir(folderPath);
    } catch (err) {
      console.error('Error creating folder:', err);
      throw err;
    }
  }

  async deleteItem(itemPath) {
    try {
      const stats = await fs.stat(itemPath);
      if (stats.isDirectory()) {
        await fs.rm(itemPath, { recursive: true });
      } else {
        await fs.unlink(itemPath);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      throw err;
    }
  }

  async copyItem(source, destination) {
    try {
      const stats = await fs.stat(source);
      if (stats.isDirectory()) {
        await fs.cp(source, destination, { recursive: true });
      } else {
        await fs.copyFile(source, destination);
      }
    } catch (err) {
      console.error('Error copying item:', err);
      throw err;
    }
  }
}

// Export the class itself, not an instance
module.exports = FileSystemService; 