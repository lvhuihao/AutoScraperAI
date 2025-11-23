// ============================================
// Popup 脚本 - 用户界面交互
// ============================================
// 这个文件处理弹出窗口的用户交互
// 当用户点击插件图标时，会显示这个弹出窗口

// ============================================
// 导入类型定义
// ============================================

import { ScrapeResponse, A11yResponse } from './utils/types';

// ============================================
// 导入 DOM 元素管理
// ============================================

import { DOM } from './utils/dom';

// ============================================
// 导入 UI 状态管理
// ============================================

import { showError, resetAllSections } from './utils/uiState';

// ============================================
// 导入按钮状态管理
// ============================================

import { setButtonLoading, setButtonNormal, showButtonSuccess } from './utils/buttonUtils';

// ============================================
// 导入消息通信
// ============================================

import { sendMessage } from './utils/messageUtils';

// ============================================
// 导入业务逻辑处理
// ============================================

import { displayScrapeResult } from './utils/scrapeResultHandler';
import { displayA11yResult } from './utils/a11yResultHandler';
import { copyToClipboard } from './utils/clipboardUtils';

// ============================================
// 业务逻辑 - 复制功能
// ============================================

/**
 * 处理复制无障碍信息
 */
const handleCopyA11yData = async (): Promise<void> => {
  try {
    const text = DOM.a11yData.textContent || '';
    await copyToClipboard(text);
    showButtonSuccess(DOM.copyA11yBtn, '✓');
  } catch (error) {
    console.error('复制失败:', error);
    showError('复制到剪贴板失败');
  }
};

// ============================================
// 事件处理 - 分析任务
// ============================================

/**
 * 处理分析任务
 */
const handleScrapeTask = async (): Promise<void> => {
  const task = DOM.taskInput.value.trim();
  
  if (!task) {
    showError('请输入任务描述');
    return;
  }

  // 设置按钮加载状态
  setButtonLoading(DOM.scrapeBtn, '分析中...', '开始分析');
  resetAllSections();

  try {
    // 发送消息到 background script
    const response = await sendMessage<ScrapeResponse>({
      type: 'SCRAPE_PAGE',
      task: task
    });

    if (response && response.success) {
      displayScrapeResult(response);
    } else {
      showError(response?.error || '分析失败');
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : '未知错误');
  } finally {
    setButtonNormal(DOM.scrapeBtn, '开始分析');
  }
};

// ============================================
// 事件处理 - 无障碍信息
// ============================================

/**
 * 处理获取无障碍信息
 */
const handleGetA11yInfo = async (): Promise<void> => {
  // 设置按钮加载状态
  setButtonLoading(DOM.a11yBtn, '获取中...', '获取无障碍信息');
  resetAllSections();

  try {
    // 发送消息到 background script
    const response = await sendMessage<A11yResponse>({
      type: 'GET_PAGE_A11Y_BY_CHROME'
    });

    if (response && response.success) {
      displayA11yResult(response);
    } else {
      showError(response?.error || '获取无障碍信息失败');
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : '未知错误');
  } finally {
    setButtonNormal(DOM.a11yBtn, '获取无障碍信息');
  }
};

// ============================================
// 事件监听器初始化
// ============================================

/**
 * 初始化所有事件监听器
 */
const initEventListeners = (): void => {
  DOM.scrapeBtn.addEventListener('click', handleScrapeTask);
  DOM.a11yBtn.addEventListener('click', handleGetA11yInfo);
  DOM.copyA11yBtn.addEventListener('click', handleCopyA11yData);
};

// ============================================
// 初始化
// ============================================

// 页面加载完成后初始化事件监听器
initEventListeners();

