// ============================================
// 元素信息提取相关工具函数
// ============================================

/**
 * 获取可访问性名称
 * @param element DOM 元素
 * @returns 可访问性名称或 null
 */
export const getAccessibleName = (element: Element): string | null => {
  // 优先使用 aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // 使用 aria-labelledby 引用的元素
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent?.trim() || null;
  }

  // 对于表单元素，查找关联的 label
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }
    // 查找父级 label
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent?.trim() || null;
  }

  // 对于图片，使用 alt 属性
  if (element.tagName === 'IMG') {
    return (element as HTMLImageElement).alt || null;
  }

  // 对于链接和按钮，使用文本内容
  if (element.tagName === 'A' || element.tagName === 'BUTTON') {
    return element.textContent?.trim() || null;
  }

  // 对于标题，使用文本内容
  if (/^H[1-6]$/.test(element.tagName)) {
    return element.textContent?.trim() || null;
  }

  return null;
};

/**
 * 检查元素是否可聚焦
 * @param element HTML 元素
 * @returns 是否可聚焦
 */
export const isElementFocusable = (element: HTMLElement): boolean => {
  const tagName = element.tagName.toLowerCase();
  const tabIndex = element.getAttribute('tabindex');

  // 检查 tabindex
  if (tabIndex !== null) {
    const index = parseInt(tabIndex);
    return index >= 0 || index === -1;
  }

  // 检查原生可聚焦元素
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea', 'iframe'];
  if (focusableTags.includes(tagName)) {
    // 检查是否被禁用
    if (tagName === 'button' || tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
      return !(element as HTMLButtonElement | HTMLInputElement).disabled;
    }
    // 检查链接是否有 href
    if (tagName === 'a') {
      return !!(element as HTMLAnchorElement).href;
    }
    return true;
  }

  // 检查是否有 role="button" 等交互角色
  const role = element.getAttribute('role');
  const interactiveRoles = ['button', 'link', 'menuitem', 'option', 'tab', 'textbox', 'checkbox', 'radio'];
  if (role && interactiveRoles.includes(role)) {
    return true;
  }

  return false;
};

/**
 * 检查元素是否可见
 * @param element HTML 元素
 * @returns 是否可见
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

/**
 * 获取元素的 ARIA 属性
 * @param element DOM 元素
 * @returns ARIA 属性对象
 */
export const getAriaAttributes = (element: Element) => {
  return {
    label: element.getAttribute('aria-label'),
    labelledBy: element.getAttribute('aria-labelledby'),
    describedBy: element.getAttribute('aria-describedby'),
    hidden: element.getAttribute('aria-hidden') === 'true',
    expanded: element.getAttribute('aria-expanded'),
    checked: element.getAttribute('aria-checked'),
    selected: element.getAttribute('aria-selected'),
    disabled: element.getAttribute('aria-disabled') === 'true',
    required: element.getAttribute('aria-required') === 'true',
    invalid: element.getAttribute('aria-invalid') === 'true',
    live: element.getAttribute('aria-live'),
    atomic: element.getAttribute('aria-atomic') === 'true'
  };
};

