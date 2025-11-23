// ============================================
// 通用工具函数
// ============================================

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

