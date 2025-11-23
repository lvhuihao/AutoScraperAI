// ============================================
// 消息处理相关工具函数
// ============================================

/**
 * 创建成功响应
 * @param data 响应数据（可以是对象或任何值）
 * @returns 成功响应对象
 */
export const createSuccessResponse = (data: unknown) => {
  // 如果 data 是对象，展开它；否则包装在 data 字段中
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return { success: true, ...data };
  }
  return { success: true, data };
};

/**
 * 创建失败响应
 * @param error 错误信息或错误对象
 * @returns 失败响应对象
 */
export const createErrorResponse = (error: unknown) => {
  return {
    success: false,
    error: error instanceof Error ? error.message : (typeof error === 'string' ? error : '未知错误')
  };
};

/**
 * 安全执行函数并返回响应
 * @param fn 要执行的函数
 * @param errorMessage 错误时的日志消息
 * @returns 响应对象
 */
export const safeExecute = <T>(
  fn: () => T,
  errorMessage: string = '执行失败'
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const data = fn();
    return createSuccessResponse({ data }) as { success: true; data: T };
  } catch (error) {
    console.error(errorMessage, error);
    return createErrorResponse(error) as { success: false; error: string };
  }
};

/**
 * 安全执行异步函数并返回响应
 * @param fn 要执行的异步函数
 * @param errorMessage 错误时的日志消息
 * @returns Promise<响应对象>
 */
export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  errorMessage: string = '执行失败'
): Promise<{ success: true; data: T } | { success: false; error: string }> => {
  try {
    const data = await fn();
    return createSuccessResponse({ data }) as { success: true; data: T };
  } catch (error) {
    console.error(errorMessage, error);
    return createErrorResponse(error) as { success: false; error: string };
  }
};

/**
 * 消息处理器配置
 */
export interface MessageHandlerConfig {
  type: string;
  handler: (message: unknown, sender: chrome.runtime.MessageSender) => unknown | Promise<unknown>;
  async?: boolean;
}

/**
 * 创建消息监听器
 * @param handlers 消息处理器配置数组
 * @returns 消息监听器函数
 */
export const createMessageListener = (handlers: MessageHandlerConfig[]) => {
  return (
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ): boolean => {
    const messageType = (message as { type?: string })?.type;
    if (!messageType) {
      return false;
    }
    const handler = handlers.find(h => h.type === messageType);
    
    if (!handler) {
      return false; // 未处理的消息类型
    }

    const executeHandler = async () => {
      try {
        const result = await handler.handler(message, sender);
        sendResponse(createSuccessResponse(result));
      } catch (error) {
        console.error(`处理消息 ${handler.type} 失败:`, error);
        sendResponse(createErrorResponse(error));
      }
    };

    if (handler.async) {
      executeHandler();
      return true; // 表示会异步响应
    } else {
      try {
        const result = handler.handler(message, sender);
        sendResponse(createSuccessResponse(result));
      } catch (error) {
        console.error(`处理消息 ${handler.type} 失败:`, error);
        sendResponse(createErrorResponse(error));
      }
      return true; // 确保响应被发送
    }
  };
};

