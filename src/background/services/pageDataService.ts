// ============================================
// 页面数据服务 - 处理页面数据获取
// ============================================

import { getActiveTab, validateTab } from '../../utils/tabHelper';
import { sendMessageToContentScript } from '../../utils/contentScriptHelper';
import { PageDataResult } from '../types';

/**
 * 获取页面数据
 * @returns 页面数据结果（包含 URL、HTML、标题和标签页 ID）
 */
export const getPageData = async (): Promise<PageDataResult> => {
  try {
    // 1. 获取当前活动的标签页
    const tab = await getActiveTab();
    const validation = validateTab(tab);

    if (!validation.valid) {
      return { success: false, error: validation.error || '无法获取标签页' };
    }

    if (!tab || !tab.id) {
      return { success: false, error: '无法获取标签页 ID' };
    }

    // 2. 发送消息到 content script（带重试和注入逻辑）
    let pageData: { success?: boolean; url?: string; html?: string; title?: string } | null = null;
    try {
      pageData = (await sendMessageToContentScript(tab.id, {
        type: 'GET_PAGE_DATA'
      })) as { success?: boolean; url?: string; html?: string; title?: string } | null;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '无法连接到页面脚本'
      };
    }

    if (!pageData || !pageData.success || !pageData.url || !pageData.html || !pageData.title) {
      return { success: false, error: '无法获取页面数据' };
    }

    return {
      success: true,
      data: {
        url: pageData.url,
        html: pageData.html,
        title: pageData.title
      },
      tabId: tab.id
    };
  } catch (error) {
    console.error('获取页面数据时出错:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

