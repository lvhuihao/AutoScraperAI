// ============================================
// 工具函数 - 消息通信
// ============================================

/**
 * 基础消息接口
 */
export interface BaseMessage {
  type: string;
  [key: string]: unknown;
}

/**
 * 发送消息到 background script
 * @param message 要发送的消息对象
 * @returns Promise<T> 响应数据
 */
export const sendMessage = async <T = unknown>(message: BaseMessage): Promise<T> => {
  return await chrome.runtime.sendMessage(message);
};

