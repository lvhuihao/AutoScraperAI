// ============================================
// 页面数据提取相关工具函数
// ============================================

/**
 * 获取页面数据
 * @returns 页面数据对象
 */
export const getPageData = () => {
  return {
    url: window.location.href,
    title: document.title,
    html: document.documentElement.outerHTML,
    text: document.body.innerText || ''
  };
};

