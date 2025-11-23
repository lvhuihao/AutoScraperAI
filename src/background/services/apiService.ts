// ============================================
// API 服务 - 处理与后端 API 的通信
// ============================================

import { getActiveTab } from '../../utils/tabHelper';
import { sendMessageToContentScript } from '../../utils/contentScriptHelper';
import { AnalyzeRequestData, AnalyzeResponse, ApiAction } from '../types';

/**
 * API 基础 URL（可以在 options 页面配置）
 */
let API_BASE_URL = 'http://localhost:3000/api';

/**
 * 获取 API URL（优先从存储中读取）
 * @returns API 基础 URL
 */
export const getApiUrl = async (): Promise<string> => {
  const result = await chrome.storage.sync.get('apiBaseUrl');
  if (result.apiBaseUrl) {
    API_BASE_URL = result.apiBaseUrl;
  }
  return API_BASE_URL;
};

/**
 * 调用后端 API 分析页面数据
 * @param pageData 页面数据（包含 URL、axTree、nodeCount）
 * @param task 分析任务描述
 * @returns API 分析响应
 */
export const analyzePageData = async (
  pageData: { url: string; axTree: string; nodeCount: number },
  task: string
): Promise<AnalyzeResponse> => {
  try {
    // 1. 准备发送到后端 API 的数据
    const requestData: AnalyzeRequestData = {
      url: pageData.url,
      axTree: pageData.axTree,
      nodeCount: pageData.nodeCount,
      module: 'qwen3-30b-a3b-instruct-2507',
      task: task
    };

    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      throw new Error('无法获取标签页 ID');
    }

    // 2. 调用后端 API
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.statusText}`);
    }

    const result: AnalyzeResponse = await response.json();

    // 3. 如果 API 返回了操作指令，发送给 content script 执行
    if (result.success && result.actions && result.actions.length > 0) {
      await executeActionsFromAPI(tab.id, result.actions);
    }

    return result;
  } catch (error) {
    console.error('分析页面数据时出错:', error);
    throw error;
  }
};

/**
 * 执行从 API 返回的操作指令
 * @param tabId 标签页 ID
 * @param actions 操作指令数组
 */
const executeActionsFromAPI = async (
  tabId: number,
  actions: ApiAction[]
): Promise<void> => {
  try {
    await sendMessageToContentScript(
      tabId,
      {
        type: 'EXECUTE_ACTIONS',
        actions: actions
      },
      { injectScript: false } // 操作指令不需要注入，因为已经连接过了
    );
  } catch (actionError) {
    console.error('发送操作指令到 content script 失败:', actionError);
    // 不阻止返回结果，只是记录错误
  }
};

