// ============================================
// 工具函数 - 字符串处理
// ============================================

/**
 * HTML 转义，防止 XSS 攻击
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

