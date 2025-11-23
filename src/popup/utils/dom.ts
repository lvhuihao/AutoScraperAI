// ============================================
// DOM 元素管理
// ============================================

export const DOM = {
  taskInput: document.getElementById('task-input') as HTMLTextAreaElement,
  scrapeBtn: document.getElementById('scrape-btn') as HTMLButtonElement,
  a11yBtn: document.getElementById('a11y-btn') as HTMLButtonElement,
  errorMessage: document.getElementById('error-message') as HTMLDivElement,
  resultSection: document.getElementById('result-section') as HTMLDivElement,
  resultData: document.getElementById('result-data') as HTMLDivElement,
  resultActions: document.getElementById('result-actions') as HTMLDivElement,
  resultTableContainer: document.getElementById('result-table-container') as HTMLDivElement,
  a11ySection: document.getElementById('a11y-section') as HTMLDivElement,
  a11ySummary: document.getElementById('a11y-summary') as HTMLDivElement,
  a11yData: document.getElementById('a11y-data') as HTMLDivElement,
  copyA11yBtn: document.getElementById('copy-a11y-btn') as HTMLButtonElement,
};

