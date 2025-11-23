// ============================================
// 业务逻辑 - 无障碍信息处理
// ============================================

import { DOM } from './dom';
import { A11yResponse, A11ySummary, A11yData } from './types';
import { showA11yResult } from './uiState';

/**
 * 渲染无障碍信息摘要
 */
export const renderA11ySummary = (summary: A11ySummary | undefined): void => {
  if (!summary) {
    DOM.a11ySummary.innerHTML = '<p style="color: #666; font-size: 13px;">暂无摘要信息</p>';
    return;
  }
  
  const summaryHtml = `
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-label">总元素数:</span>
        <span class="summary-value">${summary.totalElements || 0}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">有角色元素:</span>
        <span class="summary-value">${summary.elementsWithRole || 0}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">有 ARIA 标签:</span>
        <span class="summary-value">${summary.elementsWithAriaLabel || 0}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">可聚焦元素:</span>
        <span class="summary-value">${summary.focusableElements || 0}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">交互元素:</span>
        <span class="summary-value">${summary.interactiveElements || 0}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">地标元素:</span>
        <span class="summary-value">${summary.landmarks || 0}</span>
      </div>
    </div>
  `;
  DOM.a11ySummary.innerHTML = summaryHtml;
};

/**
 * 显示无障碍信息结果
 */
export const displayA11yResult = (response: A11yResponse): void => {
  showA11yResult();
  
  // 提取实际数据（可能被包装在 data 字段中，或者直接展开）
  const data: A11yData = response.data || (response as unknown as A11yData);
  
  // 显示摘要信息
  if (data && data.summary) {
    renderA11ySummary(data.summary);
  } else {
    DOM.a11ySummary.innerHTML = '<p style="color: #666; font-size: 13px;">暂无摘要信息</p>';
  }

  // 显示完整数据（使用原始响应或提取的数据）
  DOM.a11yData.textContent = JSON.stringify(data, null, 2);
};

