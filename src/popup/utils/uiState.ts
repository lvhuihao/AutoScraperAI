// ============================================
// UI 状态管理
// ============================================

import { DOM } from './dom';

/**
 * 显示错误消息
 */
export const showError = (message: string): void => {
  DOM.errorMessage.textContent = message;
  DOM.errorMessage.style.display = 'block';
};

/**
 * 隐藏错误消息
 */
export const hideError = (): void => {
  DOM.errorMessage.style.display = 'none';
};

/**
 * 显示结果区域
 */
export const showResult = (): void => {
  DOM.resultSection.style.display = 'block';
};

/**
 * 隐藏结果区域
 */
export const hideResult = (): void => {
  DOM.resultSection.style.display = 'none';
};

/**
 * 显示无障碍信息区域
 */
export const showA11yResult = (): void => {
  DOM.a11ySection.style.display = 'block';
};

/**
 * 隐藏无障碍信息区域
 */
export const hideA11yResult = (): void => {
  DOM.a11ySection.style.display = 'none';
};

/**
 * 重置所有显示区域
 */
export const resetAllSections = (): void => {
  hideError();
  hideResult();
  hideA11yResult();
};

