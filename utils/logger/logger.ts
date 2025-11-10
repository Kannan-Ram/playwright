import winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Ensure logs directory exists
 */
const logsDir = path.join(process.cwd(), 'reports', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Custom log format for better readability
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const contextStr = context ? `[${context}]` : '';
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level.toUpperCase()}] ${contextStr} ${message} ${metaStr}`;
  })
);

/**
 * Console format for development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context }) => {
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level} ${contextStr} ${message}`;
  })
);

/**
 * Logger configuration
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'sac-test-automation' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write error logs to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write debug logs to debug.log
    new winston.transports.File({
      filename: path.join(logsDir, 'debug.log'),
      level: 'debug',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
});

/**
 * Add console transport for non-production environments
 */
if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * Logger class with context support
 */
export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): Logger {
    return new Logger(context);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: Record<string, unknown>): void {
    logger.info(message, { context: this.context, ...meta });
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(message, { context: this.context, ...meta });
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const errorDetails = error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { error };
    logger.error(message, { context: this.context, ...errorDetails, ...meta });
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(message, { context: this.context, ...meta });
  }

  /**
   * Log verbose message
   */
  verbose(message: string, meta?: Record<string, unknown>): void {
    logger.verbose(message, { context: this.context, ...meta });
  }

  /**
   * Log test step
   */
  step(stepName: string, meta?: Record<string, unknown>): void {
    this.info(`Step: ${stepName}`, meta);
  }

  /**
   * Log test start
   */
  testStart(testName: string): void {
    this.info(`========== Test Started: ${testName} ==========`);
  }

  /**
   * Log test end
   */
  testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
    const logMethod = status === 'FAILED' ? 'error' : 'info';
    this[logMethod](`========== Test ${status}: ${testName} ==========`);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: unknown): void {
    this.debug(`API Request: ${method} ${url}`, { data });
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    this.debug(`API Response: ${method} ${url} - Status: ${status}`, { data });
  }
}

/**
 * Default logger instance
 */
export const defaultLogger = new Logger('Default');

/**
 * Export logger for advanced usage
 */
export { logger as winstonLogger };
