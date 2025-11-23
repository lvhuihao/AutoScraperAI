// ============================================
// Background Script (后台脚本)
// ============================================
// 这是 Chrome 插件的核心，负责：
// 1. 接收来自 popup 的消息
// 2. 与 content script 通信获取页面数据
// 3. 调用后端 API 进行分析
// 4. 将操作指令发送给 content script 执行

import { createMessageListener } from './handlers/messageHandlers';

/**
 * 初始化消息监听器
 */
const initMessageListener = (): void => {
  const listener = createMessageListener();
  chrome.runtime.onMessage.addListener(listener);
};

// 初始化
initMessageListener();
console.log('Background Script 已加载');
