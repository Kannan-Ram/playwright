/**
 * Common Locator Constants
 * Centralized locator patterns used across the framework
 */

export const LOCATORS = {
  // Common elements
  BUTTON: 'button, [role="button"]',
  LINK: 'a, [role="link"]',
  INPUT: 'input, [role="textbox"]',
  SELECT: 'select, [role="listbox"]',
  CHECKBOX: 'input[type="checkbox"], [role="checkbox"]',
  RADIO: 'input[type="radio"], [role="radio"]',
  TEXTAREA: 'textarea',

  // Loading indicators
  LOADING: {
    SPINNER: '.loading, .spinner, [data-loading="true"]',
    PROGRESS_BAR: '.progress-bar, [role="progressbar"]',
    OVERLAY: '.loading-overlay, .spinner-overlay',
  },

  // Modals and dialogs
  MODAL: {
    CONTAINER: '.modal, [role="dialog"]',
    BACKDROP: '.modal-backdrop, .overlay',
    CLOSE_BUTTON: '.modal-close, [aria-label="Close"]',
    HEADER: '.modal-header, [role="heading"]',
    BODY: '.modal-body',
    FOOTER: '.modal-footer',
  },

  // Navigation
  NAV: {
    HEADER: 'header, [role="banner"]',
    SIDEBAR: 'aside, [role="complementary"]',
    MENU: 'nav, [role="navigation"]',
    BREADCRUMB: '[aria-label="Breadcrumb"], .breadcrumb',
  },

  // Forms
  FORM: {
    CONTAINER: 'form',
    FIELD: '.form-field, .input-field',
    LABEL: 'label',
    ERROR: '.error, .field-error, [role="alert"]',
    SUBMIT: 'button[type="submit"]',
    CANCEL: 'button[type="button"]',
  },

  // Tables
  TABLE: {
    CONTAINER: 'table, [role="table"]',
    HEADER: 'thead, [role="rowgroup"]',
    BODY: 'tbody, [role="rowgroup"]',
    ROW: 'tr, [role="row"]',
    CELL: 'td, [role="cell"]',
    HEADER_CELL: 'th, [role="columnheader"]',
  },

  // Messages
  MESSAGE: {
    SUCCESS: '.success, .alert-success',
    ERROR: '.error, .alert-error, .alert-danger',
    WARNING: '.warning, .alert-warning',
    INFO: '.info, .alert-info',
  },

  // Buttons (specific actions)
  ACTION: {
    SAVE: '[data-action="save"], button:has-text("Save")',
    CANCEL: '[data-action="cancel"], button:has-text("Cancel")',
    DELETE: '[data-action="delete"], button:has-text("Delete")',
    EDIT: '[data-action="edit"], button:has-text("Edit")',
    CREATE: '[data-action="create"], button:has-text("Create")',
    SUBMIT: '[data-action="submit"], button[type="submit"]',
    CONFIRM: '[data-action="confirm"], button:has-text("Confirm")',
  },

  // SAP Analytics Cloud specific
  SAC: {
    STORY: {
      CANVAS: '.sac-story-canvas',
      WIDGET: '.sac-widget',
      CHART: '.sac-chart',
      TABLE: '.sac-table',
      FILTER: '.sac-filter',
    },
    TOOLBAR: {
      CONTAINER: '.sac-toolbar',
      BUTTON: '.sac-toolbar-button',
    },
    PANEL: {
      PROPERTIES: '.sac-properties-panel',
      DATA_SOURCES: '.sac-datasources-panel',
      OUTLINE: '.sac-outline-panel',
    },
  },
};

/**
 * Build data-testid locator
 */
export function testId(id: string): string {
  return `[data-testid="${id}"]`;
}

/**
 * Build aria-label locator
 */
export function ariaLabel(label: string): string {
  return `[aria-label="${label}"]`;
}

/**
 * Build role locator
 */
export function role(roleName: string): string {
  return `[role="${roleName}"]`;
}

/**
 * Build class locator
 */
export function className(name: string): string {
  return `.${name}`;
}

/**
 * Build ID locator
 */
export function id(identifier: string): string {
  return `#${identifier}`;
}

/**
 * Combine multiple locators with OR
 */
export function or(...locators: string[]): string {
  return locators.join(', ');
}
