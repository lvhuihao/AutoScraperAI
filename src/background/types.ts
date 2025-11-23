// ============================================
// Background 模块类型定义
// ============================================

/**
 * 消息类型枚举
 */
export enum MessageType {
  SCRAPE_PAGE = 'SCRAPE_PAGE',
  GET_PAGE_A11Y = 'GET_PAGE_A11Y',
  GET_PAGE_A11Y_BY_CHROME = 'GET_PAGE_A11Y_BY_CHROME',
  EXECUTE_ACTIONS = 'EXECUTE_ACTIONS'
}

/**
 * 基础消息接口
 */
export interface BaseMessage {
  type: MessageType | string;
}

/**
 * 爬取页面消息
 */
export interface ScrapePageMessage extends BaseMessage {
  type: MessageType.SCRAPE_PAGE;
  task: string;
}

/**
 * 获取页面数据响应
 */
export interface PageDataResponse {
  success: true;
  data: {
    url: string;
    html: string;
    title: string;
  };
  tabId: number;
}

/**
 * 页面数据错误响应
 */
export interface PageDataErrorResponse {
  success: false;
  error: string;
}

/**
 * 页面数据响应类型
 */
export type PageDataResult = PageDataResponse | PageDataErrorResponse;

/**
 * 页面无障碍数据
 */
export interface PageA11yData {
  url: string;
  timestamp: string;
  axTree: string;
  nodeCount: number;
}

/**
 * 页面无障碍响应
 */
export interface PageA11yResponse {
  success: true;
  data: PageA11yData;
  method: string;
}

/**
 * 页面无障碍错误响应
 */
export interface PageA11yErrorResponse {
  success: false;
  error: string;
}

/**
 * 页面无障碍结果类型
 */
export type PageA11yResult = PageA11yResponse | PageA11yErrorResponse;

/**
 * API 分析请求数据
 */
export interface AnalyzeRequestData {
  url: string;
  axTree: string;
  nodeCount: number;
  module: string;
  task: string;
}

/**
 * API 操作动作
 */
export interface ApiAction {
  type: string;
  selector?: string;
  text?: string;
}

/**
 * API 分析响应
 */
export interface AnalyzeResponse {
  success: boolean;
  data?: {
    analysis?: string;
    [key: string]: unknown;
  };
  actions?: ApiAction[];
  error?: string;
}

