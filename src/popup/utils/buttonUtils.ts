// ============================================
// 工具函数 - 按钮状态管理
// ============================================

/**
 * 设置按钮加载状态
 */
export const setButtonLoading = (button: HTMLButtonElement, loadingText: string, originalText: string): void => {
  button.disabled = true;
  button.textContent = loadingText;
};

/**
 * 恢复按钮正常状态
 */
export const setButtonNormal = (button: HTMLButtonElement, normalText: string): void => {
  button.disabled = false;
  button.textContent = normalText;
};

/**
 * 显示按钮成功状态（临时）
 */
export const showButtonSuccess = (button: HTMLButtonElement, successText: string, duration: number = 2000): void => {
  const originalText = button.textContent || '';
  button.textContent = successText;
  button.style.color = '#4caf50';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.color = '';
  }, duration);
};

