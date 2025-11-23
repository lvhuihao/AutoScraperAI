// ============================================
// 类型定义
// ============================================

export interface ScrapeResponse {
  success: boolean;
  data?: string;
  actions?: Array<{
    type: string;
    selector?: string;
    text?: string;
  }>;
  error?: string;
}

export interface A11ySummary {
  totalElements?: number;
  elementsWithRole?: number;
  elementsWithAriaLabel?: number;
  focusableElements?: number;
  interactiveElements?: number;
  landmarks?: number;
}

export interface A11yData {
  summary?: A11ySummary;
  [key: string]: unknown;
}

export interface A11yResponse {
  success: boolean;
  data?: A11yData;
  error?: string;
}

export interface ParseResult {
  success: boolean;
  data?: Array<Record<string, string>>;
  error?: string;
}

