import { FullConfig } from '@playwright/test';
import { Logger } from './logger/logger';
import { FileHelper } from './helpers/file-helper';
import * as path from 'path';

const logger = new Logger('GlobalTeardown');

/**
 * Global teardown executed after all tests
 * Performs cleanup and reporting
 */
async function globalTeardown(config: FullConfig): Promise<void> {
  logger.info('========== Starting Global Teardown ==========');

  try {
    // Cleanup tasks
    await performCleanup();

    // Generate reports
    await generateReports();

    // Archive test results if needed
    if (process.env.ARCHIVE_RESULTS === 'true') {
      await archiveResults();
    }

    logger.info('========== Global Teardown Completed Successfully ==========');
  } catch (error) {
    logger.error('Global teardown failed', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

/**
 * Perform cleanup tasks
 */
async function performCleanup(): Promise<void> {
  logger.info('Performing cleanup tasks...');

  try {
    // Clean up temporary files
    const tempDir = path.join(process.cwd(), 'temp');
    if (FileHelper.directoryExists(tempDir)) {
      logger.info('Cleaning temporary files');
      FileHelper.deleteDirectory(tempDir);
    }

    // Clean up old screenshots if configured
    if (process.env.CLEAN_OLD_SCREENSHOTS === 'true') {
      await cleanOldFiles('screenshots', 7); // Keep files from last 7 days
    }

    // Clean up old test results if configured
    if (process.env.CLEAN_OLD_RESULTS === 'true') {
      await cleanOldFiles('test-results', 7);
    }

    // Additional cleanup tasks
    // - Close database connections
    // - Stop mock servers
    // - Clean up test data
    // - Reset external services

    logger.info('Cleanup tasks completed');
  } catch (error) {
    logger.warn('Some cleanup tasks failed', { error });
  }
}

/**
 * Clean old files from directory
 */
async function cleanOldFiles(directory: string, daysToKeep: number): Promise<void> {
  const dirPath = path.join(process.cwd(), directory);

  if (!FileHelper.directoryExists(dirPath)) {
    return;
  }

  const files = FileHelper.listFiles(dirPath, true);
  const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

  let deletedCount = 0;

  for (const file of files) {
    try {
      const stats = await import('fs').then((fs) => fs.promises.stat(file));
      if (stats.mtimeMs < cutoffTime) {
        FileHelper.deleteFile(file);
        deletedCount++;
      }
    } catch (error) {
      logger.warn(`Failed to clean file: ${file}`, { error });
    }
  }

  logger.info(`Cleaned ${deletedCount} old files from ${directory}`);
}

/**
 * Generate reports
 */
async function generateReports(): Promise<void> {
  logger.info('Generating test reports...');

  try {
    // Generate custom reports if needed
    await generateSummaryReport();

    // Send notifications if configured
    if (process.env.SEND_NOTIFICATIONS === 'true') {
      await sendNotifications();
    }

    logger.info('Reports generated successfully');
  } catch (error) {
    logger.warn('Report generation failed', { error });
  }
}

/**
 * Generate summary report
 */
async function generateSummaryReport(): Promise<void> {
  const reportPath = path.join(process.cwd(), 'reports', 'test-results.json');

  if (!FileHelper.fileExists(reportPath)) {
    logger.debug('No test results file found, skipping summary report');
    return;
  }

  try {
    const results = FileHelper.readJSON(reportPath);

    // Create a simple summary
    const summary = {
      timestamp: new Date().toISOString(),
      environment: process.env.ENVIRONMENT || 'dev',
      results: results,
      // Add more summary data as needed
    };

    const summaryPath = path.join(process.cwd(), 'reports', 'summary.json');
    FileHelper.writeJSON(summaryPath, summary);

    logger.info(`Summary report saved to: ${summaryPath}`);
  } catch (error) {
    logger.warn('Failed to generate summary report', { error });
  }
}

/**
 * Archive test results
 */
async function archiveResults(): Promise<void> {
  logger.info('Archiving test results...');

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveDir = path.join(process.cwd(), 'archives', timestamp);

    FileHelper.createDirectory(archiveDir);

    // Copy reports
    const reportsDir = path.join(process.cwd(), 'reports');
    if (FileHelper.directoryExists(reportsDir)) {
      const files = FileHelper.listFiles(reportsDir);
      files.forEach((file) => {
        const fileName = path.basename(file);
        FileHelper.copyFile(file, path.join(archiveDir, fileName));
      });
    }

    logger.info(`Results archived to: ${archiveDir}`);
  } catch (error) {
    logger.warn('Failed to archive results', { error });
  }
}

/**
 * Send notifications
 */
async function sendNotifications(): Promise<void> {
  logger.info('Sending notifications...');

  // Implement notification logic here
  // Examples:
  // - Send email with test results
  // - Post to Slack
  // - Update dashboard
  // - Create JIRA tickets for failures

  logger.info('Notifications sent');
}

export default globalTeardown;
