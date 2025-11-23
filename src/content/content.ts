// ============================================
// Content Script (内容脚本)
// ============================================
// 这个脚本会被注入到每个网页中，可以：
// 1. 访问和操作页面的 DOM
// 2. 爬取页面数据
// 3. 执行页面操作（点击、滚动等）

import { getPageData } from '../utils/pageHelper';
import { getPageA11y } from '../utils/a11yHelper';
import { executeActions } from '../utils/actionHelper';
import { createMessageListener } from '../utils/messageHandler';

// 定义消息处理器
const messageHandlers = [
  {
    type: 'GET_PAGE_DATA',
    handler: () => {
      return getPageData();
    }
  },
  {
    type: 'GET_PAGE_A11Y',
    handler: () => {
      return getPageA11y();
    }
  },
  {
    type: 'EXECUTE_ACTIONS',
    handler: async (message: unknown) => {
      const actions = (message as { actions?: unknown })?.actions;
      if (!Array.isArray(actions)) {
        throw new Error('Invalid actions format');
      }
      const results = await executeActions(actions);
      return { results };
    },
    async: true
  }
];

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener(createMessageListener(messageHandlers));

console.log('Content Script 已加载');

