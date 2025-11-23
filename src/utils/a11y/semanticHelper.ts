// ============================================
// 语义化信息相关工具函数
// ============================================

/**
 * 获取语义化信息
 * @param element DOM 元素
 * @returns 语义化信息对象
 */
export const getSemanticInfo = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');

  return {
    isInteractive:
      ['button', 'a', 'input', 'select', 'textarea'].includes(tagName) ||
      ['button', 'link', 'menuitem', 'option', 'tab'].includes(role || ''),
    isLandmark:
      ['nav', 'main', 'header', 'footer', 'aside', 'article', 'section'].includes(tagName) ||
      ['navigation', 'main', 'banner', 'contentinfo', 'complementary', 'article', 'region'].includes(role || ''),
    isHeading: /^H[1-6]$/.test(element.tagName),
    isList: ['ul', 'ol'].includes(tagName),
    isListItem: tagName === 'li',
    isTable: tagName === 'table',
    isForm: tagName === 'form',
    isFormControl: ['input', 'select', 'textarea', 'button'].includes(tagName)
  };
};

