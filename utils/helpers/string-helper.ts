/**
 * String Helper Utility
 * Provides common string operations for test automation
 */
export class StringHelper {
  /**
   * Generate random string
   */
  static randomString(length: number = 10, includeNumbers: boolean = true): string {
    const chars = includeNumbers
      ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random alphanumeric string
   */
  static randomAlphanumeric(length: number = 10): string {
    return this.randomString(length, true);
  }

  /**
   * Generate random email
   */
  static randomEmail(domain: string = 'test.com'): string {
    const username = this.randomString(8).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Generate random phone number
   */
  static randomPhoneNumber(format: string = '###-###-####'): string {
    return format.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
  }

  /**
   * Generate UUID
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Convert to camelCase
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  /**
   * Convert to PascalCase
   */
  static toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  }

  /**
   * Convert to snake_case
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/^_/, '');
  }

  /**
   * Convert to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^-/, '');
  }

  /**
   * Truncate string
   */
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Remove special characters
   */
  static removeSpecialChars(str: string, keepSpaces: boolean = true): string {
    const pattern = keepSpaces ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z0-9]/g;
    return str.replace(pattern, '');
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Capitalize each word
   */
  static capitalizeWords(str: string): string {
    return str
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  }

  /**
   * Extract numbers from string
   */
  static extractNumbers(str: string): number[] {
    const matches = str.match(/\d+/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Extract first number from string
   */
  static extractFirstNumber(str: string): number | null {
    const numbers = this.extractNumbers(str);
    return numbers.length > 0 ? numbers[0] : null;
  }

  /**
   * Count words
   */
  static countWords(str: string): number {
    return str.trim().split(/\s+/).length;
  }

  /**
   * Reverse string
   */
  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  /**
   * Check if string is palindrome
   */
  static isPalindrome(str: string): boolean {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === this.reverse(cleaned);
  }

  /**
   * Mask string (e.g., for passwords or credit cards)
   */
  static mask(
    str: string,
    visibleChars: number = 4,
    maskChar: string = '*',
    position: 'start' | 'end' = 'end'
  ): string {
    if (str.length <= visibleChars) return str;

    const masked = maskChar.repeat(str.length - visibleChars);
    return position === 'end'
      ? masked + str.slice(-visibleChars)
      : str.slice(0, visibleChars) + masked;
  }

  /**
   * Generate slug from string
   */
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Escape HTML
   */
  static escapeHtml(str: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
  }

  /**
   * Unescape HTML
   */
  static unescapeHtml(str: string): string {
    const htmlUnescapes: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
    };
    return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => htmlUnescapes[entity] || entity);
  }

  /**
   * Compare strings (case insensitive)
   */
  static equalsIgnoreCase(str1: string, str2: string): boolean {
    return str1.toLowerCase() === str2.toLowerCase();
  }

  /**
   * Check if string contains substring (case insensitive)
   */
  static containsIgnoreCase(str: string, substring: string): boolean {
    return str.toLowerCase().includes(substring.toLowerCase());
  }

  /**
   * Format string with placeholders
   */
  static format(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return key in values ? String(values[key]) : match;
    });
  }

  /**
   * Parse query string to object
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    const pairs = queryString.replace(/^\?/, '').split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    return params;
  }

  /**
   * Convert object to query string
   */
  static toQueryString(params: Record<string, string | number | boolean>): string {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}
