import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

/**
 * Date Helper Utility
 * Provides common date operations for test automation
 */
export class DateHelper {
  private static readonly DEFAULT_FORMAT = 'YYYY-MM-DD';
  private static readonly DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  private static readonly TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

  /**
   * Get current date
   */
  static getCurrentDate(format: string = this.DEFAULT_FORMAT): string {
    return dayjs().format(format);
  }

  /**
   * Get current date time
   */
  static getCurrentDateTime(format: string = this.DATETIME_FORMAT): string {
    return dayjs().format(format);
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): number {
    return dayjs().valueOf();
  }

  /**
   * Format date
   */
  static formatDate(date: string | Date | Dayjs, format: string = this.DEFAULT_FORMAT): string {
    return dayjs(date).format(format);
  }

  /**
   * Parse date string
   */
  static parseDate(dateString: string, format?: string): Dayjs {
    return format ? dayjs(dateString, format) : dayjs(dateString);
  }

  /**
   * Add days to date
   */
  static addDays(date: string | Date | Dayjs, days: number, format?: string): string {
    const result = dayjs(date).add(days, 'day');
    return format ? result.format(format) : result.format(this.DEFAULT_FORMAT);
  }

  /**
   * Subtract days from date
   */
  static subtractDays(date: string | Date | Dayjs, days: number, format?: string): string {
    const result = dayjs(date).subtract(days, 'day');
    return format ? result.format(format) : result.format(this.DEFAULT_FORMAT);
  }

  /**
   * Add months to date
   */
  static addMonths(date: string | Date | Dayjs, months: number, format?: string): string {
    const result = dayjs(date).add(months, 'month');
    return format ? result.format(format) : result.format(this.DEFAULT_FORMAT);
  }

  /**
   * Subtract months from date
   */
  static subtractMonths(date: string | Date | Dayjs, months: number, format?: string): string {
    const result = dayjs(date).subtract(months, 'month');
    return format ? result.format(format) : result.format(this.DEFAULT_FORMAT);
  }

  /**
   * Get date difference in days
   */
  static getDifferenceInDays(date1: string | Date | Dayjs, date2: string | Date | Dayjs): number {
    return dayjs(date1).diff(dayjs(date2), 'day');
  }

  /**
   * Check if date is in the past
   */
  static isInPast(date: string | Date | Dayjs): boolean {
    return dayjs(date).isBefore(dayjs());
  }

  /**
   * Check if date is in the future
   */
  static isInFuture(date: string | Date | Dayjs): boolean {
    return dayjs(date).isAfter(dayjs());
  }

  /**
   * Check if date is between two dates
   */
  static isBetween(
    date: string | Date | Dayjs,
    startDate: string | Date | Dayjs,
    endDate: string | Date | Dayjs,
    inclusivity: '()' | '[]' | '[)' | '(]' = '[]'
  ): boolean {
    return dayjs(date).isBetween(startDate, endDate, null, inclusivity);
  }

  /**
   * Get start of day
   */
  static getStartOfDay(date: string | Date | Dayjs, format?: string): string {
    const result = dayjs(date).startOf('day');
    return format ? result.format(format) : result.format(this.DATETIME_FORMAT);
  }

  /**
   * Get end of day
   */
  static getEndOfDay(date: string | Date | Dayjs, format?: string): string {
    const result = dayjs(date).endOf('day');
    return format ? result.format(format) : result.format(this.DATETIME_FORMAT);
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static getRelativeTime(date: string | Date | Dayjs): string {
    return dayjs(date).fromNow();
  }

  /**
   * Convert to UTC
   */
  static toUTC(date: string | Date | Dayjs, format?: string): string {
    const result = dayjs(date).utc();
    return format ? result.format(format) : result.format(this.DATETIME_FORMAT);
  }

  /**
   * Convert to timezone
   */
  static toTimezone(
    date: string | Date | Dayjs,
    tz: string,
    format?: string
  ): string {
    const result = dayjs(date).tz(tz);
    return format ? result.format(format) : result.format(this.DATETIME_FORMAT);
  }

  /**
   * Generate date range
   */
  static generateDateRange(
    startDate: string | Date | Dayjs,
    endDate: string | Date | Dayjs,
    format: string = this.DEFAULT_FORMAT
  ): string[] {
    const dates: string[] = [];
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      dates.push(currentDate.format(format));
      currentDate = currentDate.add(1, 'day');
    }

    return dates;
  }

  /**
   * Validate date format
   */
  static isValidDate(dateString: string, format?: string): boolean {
    return dayjs(dateString, format, true).isValid();
  }

  /**
   * Get random date between two dates
   */
  static getRandomDate(
    startDate: string | Date | Dayjs,
    endDate: string | Date | Dayjs,
    format: string = this.DEFAULT_FORMAT
  ): string {
    const start = dayjs(startDate).valueOf();
    const end = dayjs(endDate).valueOf();
    const random = Math.random() * (end - start) + start;
    return dayjs(random).format(format);
  }
}
