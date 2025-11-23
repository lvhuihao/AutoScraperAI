// ============================================
// 工具函数 - 剪贴板功能
// ============================================

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

