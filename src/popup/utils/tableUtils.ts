// ============================================
// 工具函数 - 表格渲染
// ============================================

import { escapeHtml } from './stringUtils';

/**
 * 格式化表格单元格的值
 * @param value 单元格值
 * @returns 格式化后的 HTML 字符串
 */
export const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '<span class="null-value">-</span>';
  }
  
  if (typeof value === 'object') {
    return '<span class="object-value">' + escapeHtml(JSON.stringify(value, null, 2)) + '</span>';
  }
  
  if (typeof value === 'boolean') {
    return `<span class="boolean-value">${value ? '是' : '否'}</span>`;
  }
  
  return escapeHtml(String(value));
};

/**
 * 渲染数组数据为表格
 * @param data 数组数据
 * @param container 容器元素
 */
const renderArrayTable = (data: Array<Record<string, unknown>>, container: HTMLDivElement): void => {
  if (data.length === 0) {
    container.innerHTML = '<p style="color: #666; font-size: 13px;">数据为空</p>';
    return;
  }
  
  // 获取所有可能的键（从所有对象中收集）
  const allKeys = new Set<string>();
  data.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key));
    }
  });
  
  const keys = Array.from(allKeys);
  
  if (keys.length === 0) {
    container.innerHTML = '<p style="color: #666; font-size: 13px;">无法解析为表格数据</p>';
    return;
  }
  
  // 创建表格
  let tableHtml = '<div class="table-wrapper"><table class="data-table"><thead><tr>';
  keys.forEach(key => {
    tableHtml += `<th>${escapeHtml(key)}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';
  
  data.forEach((item: Record<string, unknown>) => {
    tableHtml += '<tr>';
    keys.forEach(key => {
      const value = item[key];
      const cellValue = formatCellValue(value);
      tableHtml += `<td>${cellValue}</td>`;
    });
    tableHtml += '</tr>';
  });
  
  tableHtml += '</tbody></table></div>';
  container.innerHTML = tableHtml;
};

/**
 * 渲染对象数据为表格（键值对形式）
 * @param data 对象数据
 * @param container 容器元素
 */
const renderObjectTable = (data: Record<string, unknown>, container: HTMLDivElement): void => {
  const keys = Object.keys(data);
  
  if (keys.length === 0) {
    container.innerHTML = '<p style="color: #666; font-size: 13px;">数据为空</p>';
    return;
  }
  
  // 创建表格（对象转表格：键值对形式）
  let tableHtml = '<div class="table-wrapper"><table class="data-table"><thead><tr><th>键</th><th>值</th></tr></thead><tbody>';
  
  keys.forEach(key => {
    const value = data[key];
    const cellValue = formatCellValue(value);
    tableHtml += `<tr><td>${escapeHtml(key)}</td><td>${cellValue}</td></tr>`;
  });
  
  tableHtml += '</tbody></table></div>';
  container.innerHTML = tableHtml;
};

/**
 * 将数据渲染为表格
 * @param data 要渲染的数据（数组或对象）
 * @param container 容器元素
 */
export const renderTable = (data: Array<Record<string, unknown>> | Record<string, unknown> | null, container: HTMLDivElement): void => {
  if (Array.isArray(data)) {
    renderArrayTable(data, container);
  } else if (typeof data === 'object' && data !== null) {
    renderObjectTable(data, container);
  } else {
    container.innerHTML = `<p style="color: #666; font-size: 13px;">数据类型不支持表格显示: ${typeof data}</p>`;
  }
};

