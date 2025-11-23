// ============================================
// 消息处理器 - 处理来自 popup 的消息
// ============================================

import { getPageData } from '../services/pageDataService';
import { getPageA11yByChrome } from '../services/cdpService';
import { analyzePageData } from '../services/apiService';
import { sendMessageToContentScript } from '../../utils/contentScriptHelper';
import { getActiveTab, validateTab } from '../../utils/tabHelper';
import { MessageType } from '../types';

/**
 * 处理页面爬取和分析
 * @param task 分析任务描述
 * @param sendResponse 响应回调函数
 */
export const handleScrapePage = async (
  task: string,
  sendResponse: (response: unknown) => void
): Promise<void> => {
  try {
    // 1. 获取页面数据（使用 CDP 方式）
    const pageDataResult = await getPageA11yByChrome();

    if (!pageDataResult.success) {
      sendResponse(pageDataResult);
      return;
    }

    // 2. 调用后端 API 分析页面数据
    const result = await analyzePageData(
      {
        url: pageDataResult.data.url,
        axTree: pageDataResult.data.axTree,
        nodeCount: pageDataResult.data.nodeCount
      },
      task
    );

    // 3. 返回结果给 popup
    sendResponse(result);
  } catch (error) {
    console.error('处理爬取请求时出错:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
};

/**
 * 处理获取页面无障碍信息（通过 content script）
 * @param sendResponse 响应回调函数
 */
export const handleGetPageA11y = async (
  sendResponse: (response: unknown) => void
): Promise<void> => {
  try {
    // 1. 获取当前活动的标签页
    const tab = await getActiveTab();
    const validation = validateTab(tab);

    if (!validation.valid) {
      sendResponse({ success: false, error: validation.error });
      return;
    }

    // 2. 发送消息到 content script（带重试和注入逻辑）
    let a11yData: { success?: boolean; error?: string } | null = null;
    try {
      a11yData = (await sendMessageToContentScript(tab!.id!, {
        type: 'GET_PAGE_A11Y'
      })) as { success?: boolean; error?: string } | null;
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : '无法连接到页面脚本'
      });
      return;
    }

    if (!a11yData || !a11yData.success) {
      sendResponse({
        success: false,
        error: a11yData?.error || '无法获取无障碍信息'
      });
      return;
    }

    // 3. 返回无障碍信息
    sendResponse(a11yData);
  } catch (error) {
    console.error('获取无障碍信息时出错:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
};

/**
 * 处理通过 Chrome DevTools Protocol (CDP) 获取页面无障碍信息
 * @param sendResponse 响应回调函数
 */
export const handleGetPageA11yByChrome = async (
  sendResponse: (response: unknown) => void
): Promise<void> => {
  try {
    const result = await getPageA11yByChrome();
    sendResponse(result);
  } catch (error) {
    console.error('处理 CDP 获取无障碍信息时出错:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
};

/**
 * 创建消息监听器
 * @returns 消息监听器函数
 */
export const createMessageListener = () => {
  return (
    message: { type: string; task?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ): boolean => {
    // 处理 SCRAPE_PAGE 消息（来自 popup）
    if (message.type === MessageType.SCRAPE_PAGE) {
      if (message.task) {
        handleScrapePage(message.task, sendResponse);
        return true; // 表示我们会异步响应
      }
      sendResponse({ success: false, error: '缺少任务描述' });
      return true;
    }

    // 处理 GET_PAGE_A11Y 消息（来自 popup）
    if (message.type === MessageType.GET_PAGE_A11Y) {
      handleGetPageA11y(sendResponse);
      return true; // 表示我们会异步响应
    }

    // 处理 GET_PAGE_A11Y_BY_CHROME 消息（来自 popup，使用 CDP 方式）
    if (message.type === MessageType.GET_PAGE_A11Y_BY_CHROME) {
      handleGetPageA11yByChrome(sendResponse);
      return true; // 表示我们会异步响应
    }

    return false; // 未处理的消息类型
  };
};

