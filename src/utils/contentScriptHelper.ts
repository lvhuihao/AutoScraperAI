// ============================================
// Content Script 通信工具函数
// ============================================

import { sleep } from './common';

/**
 * 发送消息到 content script，如果失败则尝试注入后重试
 * @param tabId 标签页 ID
 * @param message 要发送的消息
 * @param retryOptions 重试选项
 * @returns 响应数据
 */
/**
 * 消息接口
 */
export interface ContentScriptMessage {
  type: string;
  [key: string]: unknown;
}

/**
 * 发送消息到 content script，如果失败则尝试注入后重试
 * @param tabId 标签页 ID
 * @param message 要发送的消息
 * @param retryOptions 重试选项
 * @returns 响应数据
 */
export const sendMessageToContentScript = async (
  tabId: number,
  message: ContentScriptMessage,
  retryOptions: {
    injectScript?: boolean;
    injectFiles?: string[];
    retryDelay?: number;
  } = {}
): Promise<unknown> => {
  const {
    injectScript = true,
    injectFiles = ['content/content.js'],
    retryDelay = 200
  } = retryOptions;

  try {
    // 先尝试直接发送消息
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (messageError) {
    // 如果消息发送失败，尝试注入 content script
    if (injectScript) {
      console.log('Content script 可能未加载，尝试注入...', messageError);
      
      try {
        // 尝试注入 content script
        await chrome.scripting.executeScript({
          target: { tabId },
          files: injectFiles
        });
        
        // 等待 content script 加载完成
        await sleep(retryDelay);
        
        // 再次尝试发送消息
        return await chrome.tabs.sendMessage(tabId, message);
      } catch (retryError) {
        console.error('无法连接到页面脚本:', retryError);
        throw new Error(
          '无法连接到页面脚本。请确保：\n1. 页面已完全加载\n2. 刷新页面后重试\n3. 当前页面支持内容脚本注入'
        );
      }
    } else {
      throw messageError;
    }
  }
};

/**
 * 发送消息到 content script（不重试）
 * @param tabId 标签页 ID
 * @param message 要发送的消息
 * @returns 响应数据
 */
export const sendMessageToContentScriptDirect = async (
  tabId: number,
  message: ContentScriptMessage
): Promise<unknown> => {
  return await chrome.tabs.sendMessage(tabId, message);
};

