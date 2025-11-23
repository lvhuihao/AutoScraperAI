// ============================================
// 标签页相关工具函数
// ============================================

/**
 * 获取当前活动的标签页
 * @returns 当前活动的标签页，如果不存在则返回 null
 */
export const getActiveTab = async (): Promise<chrome.tabs.Tab | null> => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    return tab || null;
  } catch (error) {
    console.error('获取活动标签页失败:', error);
    return null;
  }
};

/**
 * 检查 URL 是否支持 content script 注入
 * @param url 要检查的 URL
 * @returns 是否支持 content script
 */
export const isUrlSupported = (url: string | undefined): boolean => {
  if (!url) return false;
  
  const unsupportedProtocols = [
    'chrome://',
    'chrome-extension://',
    'edge://',
    'about:'
  ];
  
  return !unsupportedProtocols.some(protocol => url.startsWith(protocol));
};

/**
 * 验证标签页是否可用
 * @param tab 标签页对象
 * @returns 验证结果和错误信息
 */
export const validateTab = (tab: chrome.tabs.Tab | null): { valid: boolean; error?: string } => {
  if (!tab) {
    return { valid: false, error: '无法获取当前标签页' };
  }
  
  if (!tab.id) {
    return { valid: false, error: '标签页 ID 不存在' };
  }
  
  if (!isUrlSupported(tab.url)) {
    return { valid: false, error: '当前页面不支持分析，请打开普通网页' };
  }
  
  return { valid: true };
};

