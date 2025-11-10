import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../logger/logger';

const logger = new Logger('FileHelper');

/**
 * File Helper Utility
 * Provides file system operations for test automation
 */
export class FileHelper {
  /**
   * Read file content
   */
  static readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): string {
    try {
      logger.debug(`Reading file: ${filePath}`);
      const content = fs.readFileSync(filePath, encoding);
      logger.debug(`File read successfully: ${filePath}`);
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Read JSON file
   */
  static readJSON<T = unknown>(filePath: string): T {
    try {
      logger.debug(`Reading JSON file: ${filePath}`);
      const content = this.readFile(filePath);
      const data = JSON.parse(content);
      logger.debug(`JSON file read successfully: ${filePath}`);
      return data;
    } catch (error) {
      logger.error(`Failed to read JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Write content to file
   */
  static writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf-8'): void {
    try {
      logger.debug(`Writing file: ${filePath}`);
      const directory = path.dirname(filePath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      fs.writeFileSync(filePath, content, encoding);
      logger.debug(`File written successfully: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Write JSON to file
   */
  static writeJSON(filePath: string, data: unknown, pretty: boolean = true): void {
    try {
      logger.debug(`Writing JSON file: ${filePath}`);
      const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      this.writeFile(filePath, content);
      logger.debug(`JSON file written successfully: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Append content to file
   */
  static appendFile(filePath: string, content: string, encoding: BufferEncoding = 'utf-8'): void {
    try {
      logger.debug(`Appending to file: ${filePath}`);
      fs.appendFileSync(filePath, content, encoding);
      logger.debug(`Content appended successfully: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to append to file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Check if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  }

  /**
   * Check if directory exists
   */
  static directoryExists(dirPath: string): boolean {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  /**
   * Create directory
   */
  static createDirectory(dirPath: string): void {
    try {
      if (!this.directoryExists(dirPath)) {
        logger.debug(`Creating directory: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
        logger.debug(`Directory created: ${dirPath}`);
      }
    } catch (error) {
      logger.error(`Failed to create directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  static deleteFile(filePath: string): void {
    try {
      if (this.fileExists(filePath)) {
        logger.debug(`Deleting file: ${filePath}`);
        fs.unlinkSync(filePath);
        logger.debug(`File deleted: ${filePath}`);
      }
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Delete directory
   */
  static deleteDirectory(dirPath: string): void {
    try {
      if (this.directoryExists(dirPath)) {
        logger.debug(`Deleting directory: ${dirPath}`);
        fs.rmSync(dirPath, { recursive: true, force: true });
        logger.debug(`Directory deleted: ${dirPath}`);
      }
    } catch (error) {
      logger.error(`Failed to delete directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Copy file
   */
  static copyFile(sourcePath: string, destPath: string): void {
    try {
      logger.debug(`Copying file from ${sourcePath} to ${destPath}`);
      const destDir = path.dirname(destPath);

      // Create destination directory if it doesn't exist
      if (!this.directoryExists(destDir)) {
        this.createDirectory(destDir);
      }

      fs.copyFileSync(sourcePath, destPath);
      logger.debug(`File copied successfully`);
    } catch (error) {
      logger.error(`Failed to copy file from ${sourcePath} to ${destPath}`, error);
      throw error;
    }
  }

  /**
   * Move/rename file
   */
  static moveFile(sourcePath: string, destPath: string): void {
    try {
      logger.debug(`Moving file from ${sourcePath} to ${destPath}`);
      const destDir = path.dirname(destPath);

      // Create destination directory if it doesn't exist
      if (!this.directoryExists(destDir)) {
        this.createDirectory(destDir);
      }

      fs.renameSync(sourcePath, destPath);
      logger.debug(`File moved successfully`);
    } catch (error) {
      logger.error(`Failed to move file from ${sourcePath} to ${destPath}`, error);
      throw error;
    }
  }

  /**
   * Get file size in bytes
   */
  static getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      logger.error(`Failed to get file size: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Get file extension
   */
  static getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * Get file name without extension
   */
  static getFileName(filePath: string, includeExtension: boolean = true): string {
    return includeExtension ? path.basename(filePath) : path.parse(filePath).name;
  }

  /**
   * List files in directory
   */
  static listFiles(dirPath: string, recursive: boolean = false): string[] {
    try {
      const files: string[] = [];

      if (!this.directoryExists(dirPath)) {
        return files;
      }

      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile()) {
          files.push(itemPath);
        } else if (stats.isDirectory() && recursive) {
          files.push(...this.listFiles(itemPath, recursive));
        }
      }

      return files;
    } catch (error) {
      logger.error(`Failed to list files in directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * List directories
   */
  static listDirectories(dirPath: string): string[] {
    try {
      if (!this.directoryExists(dirPath)) {
        return [];
      }

      const items = fs.readdirSync(dirPath);
      return items
        .map((item) => path.join(dirPath, item))
        .filter((itemPath) => fs.statSync(itemPath).isDirectory());
    } catch (error) {
      logger.error(`Failed to list directories in: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Find files by pattern
   */
  static findFiles(dirPath: string, pattern: RegExp, recursive: boolean = true): string[] {
    const allFiles = this.listFiles(dirPath, recursive);
    return allFiles.filter((file) => pattern.test(file));
  }

  /**
   * Get temporary directory path
   */
  static getTempDir(): string {
    return path.join(process.cwd(), 'temp');
  }

  /**
   * Create temporary file
   */
  static createTempFile(prefix: string = 'temp', extension: string = '.txt'): string {
    const tempDir = this.getTempDir();
    this.createDirectory(tempDir);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${prefix}_${timestamp}_${random}${extension}`;

    return path.join(tempDir, fileName);
  }

  /**
   * Clean temporary files
   */
  static cleanTempFiles(): void {
    const tempDir = this.getTempDir();
    if (this.directoryExists(tempDir)) {
      logger.info('Cleaning temporary files');
      this.deleteDirectory(tempDir);
    }
  }
}
