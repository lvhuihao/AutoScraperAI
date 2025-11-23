// ============================================
// 业务逻辑 - 分析结果处理
// ============================================

import { DOM } from './dom';
import { ScrapeResponse, ParseResult } from './types';
import { parseCSV, extractCSVData } from './csvUtils';
import { renderTable } from './tableUtils';
import { showResult } from './uiState';

/**
 * 解析并渲染分析数据
 */
export const parseAndRenderAnalysisData = (result: ScrapeResponse): ParseResult => {
  // 提取 CSV 数据
  let csvData: string = '';
  try {
    csvData = extractCSVData(result);
    
    if (!csvData) {
      DOM.resultData.textContent = '暂无数据';
      return { success: true, data: [] };
    }
  } catch (error) {
    const errorMessage = '解析数据失败: ' + (error instanceof Error ? error.message : '未知错误');
    console.error('解析 result.data 失败:', error);
    DOM.resultData.textContent = errorMessage;
    return { success: false, error: errorMessage };
  }

  // 清空表格容器
  DOM.resultTableContainer.innerHTML = '';
  
  try {
    // 解析 CSV 为对象数组
    const parsedData = parseCSV(csvData);
    
    if (parsedData.length === 0) {
      DOM.resultTableContainer.innerHTML = '<p style="color: #666; font-size: 13px;">数据为空</p>';
      DOM.resultData.textContent = csvData;
      return { success: true, data: [] };
    }
    
    // 将数据以表格形式呈现
    renderTable(parsedData, DOM.resultTableContainer);
    
    // 同时保留原始数据显示
    DOM.resultData.textContent = csvData;
    
    return { success: true, data: parsedData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error('解析 CSV 数据失败:', error);
    DOM.resultTableContainer.innerHTML = `<div class="error-message" style="margin-bottom: 12px;">解析 CSV 数据失败: ${errorMessage}</div>`;
    DOM.resultData.textContent = csvData;
    return { success: false, error: `解析 CSV 数据失败: ${errorMessage}` };
  }
};

/**
 * 渲染执行的操作列表
 */
export const renderActions = (actions: Array<{ type: string; selector?: string; text?: string }>): void => {
  if (!actions || actions.length === 0) {
    DOM.resultActions.innerHTML = '';
    return;
  }
  
  const actionsHtml = `
    <h4>执行的操作:</h4>
    <ul>
      ${actions.map((action) => 
        `<li>${action.type}: ${action.selector || action.text || ''}</li>`
      ).join('')}
    </ul>
  `;
  DOM.resultActions.innerHTML = actionsHtml;
};

/**
 * 显示分析结果
 */
export const displayScrapeResult = (result: ScrapeResponse): void => {
  showResult();
  
  // 解析并渲染分析数据
  parseAndRenderAnalysisData(result);
  
  // 显示执行的操作
  if (result.actions) {
    renderActions(result.actions);
  }
};

