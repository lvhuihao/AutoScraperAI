// ============================================
// 工具函数 - CSV 解析
// ============================================

/**
 * 解析 CSV 文本为对象数组
 */
export const parseCSV = (csvText: string): Array<Record<string, string>> => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return [];
  }
  
  // 第一行是列名
  const headers = lines[0].split(',').map(header => header.trim());
  
  // 解析数据行
  const data: Array<Record<string, string>> = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
};

/**
 * 从响应中提取 CSV 数据字符串
 * @param result 响应对象，可能包含 data.analysis 字段或 data 为字符串
 * @returns CSV 数据字符串
 */
export const extractCSVData = (result: { data?: { analysis?: string | unknown } | string | unknown }): string => {
  // 如果 data 是字符串，直接返回
  if (typeof result.data === 'string') {
    return result.data;
  }
  
  // 如果 data 是对象，尝试获取 analysis 字段
  if (result.data && typeof result.data === 'object' && 'analysis' in result.data) {
    const analysis = (result.data as { analysis?: string | unknown }).analysis;
    if (!analysis) {
      return '';
    }
    
    if (typeof analysis === 'string') {
      return analysis;
    }
    
    // 如果不是字符串，尝试转换为字符串
    return String(analysis);
  }
  
  return '';
};

