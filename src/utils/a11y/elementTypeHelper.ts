// ============================================
// 特定元素类型信息提取工具函数
// ============================================

/**
 * 表单信息接口
 */
export interface FormInfo {
  type: string;
  name: string | null;
  id: string | null;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  placeholder: string | null;
  labelText: string | null;
  hasLabel: boolean;
  formId: string | null;
}

/**
 * 图片信息接口
 */
export interface ImageInfo {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  title: string | null;
  width: number;
  height: number;
  isDecorative: boolean;
}

/**
 * 链接信息接口
 */
export interface LinkInfo {
  href: string;
  text: string | null;
  hasText: boolean;
  isExternal: boolean;
  target: string | null;
  ariaLabel: string | null;
}

/**
 * 标题信息接口
 */
export interface HeadingInfo {
  level: number;
  text: string | null;
}

/**
 * 列表信息接口
 */
export interface ListInfo {
  type: string;
  itemCount: number;
}

/**
 * 表格信息接口
 */
export interface TableInfo {
  hasCaption: boolean;
  captionText: string | null;
  headerCount: number;
  rowCount: number;
  hasHeader: boolean;
}

/**
 * 获取表单信息
 * @param element DOM 元素
 * @returns 表单信息对象或 null
 */
export const getFormInfo = (element: Element): FormInfo | null => {
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const form = input.form;
    const label = element.id ? document.querySelector(`label[for="${element.id}"]`) : null;

    // 安全获取 input type
    let inputType = element.tagName.toLowerCase();
    if (element.tagName === 'INPUT' && element instanceof HTMLInputElement) {
      inputType = input.type || 'text'; // 如果 type 不存在，默认为 'text'
    }

    // 安全获取 readOnly 和 placeholder（这些属性在 SELECT 上不存在）
    let readonly = false;
    let placeholder: string | null = null;
    
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      readonly = element.readOnly || false;
      placeholder = element.placeholder || null;
    }

    return {
      type: inputType,
      name: input.name || null,
      id: element.id || null,
      required: input.hasAttribute('required'),
      disabled: input.disabled || false,
      readonly: readonly,
      placeholder: placeholder,
      labelText: label?.textContent?.trim() || null,
      hasLabel: !!label,
      formId: form?.id || null
    };
  }
  return null;
};

/**
 * 获取图片信息
 * @param element DOM 元素
 * @returns 图片信息对象或 null
 */
export const getImageInfo = (element: Element): ImageInfo | null => {
  if (element.tagName === 'IMG') {
    const img = element as HTMLImageElement;
    return {
      src: img.src,
      alt: img.alt || null,
      hasAlt: !!img.alt,
      title: img.title || null,
      width: img.width,
      height: img.height,
      isDecorative: img.alt === '' && !img.getAttribute('role')
    };
  }
  return null;
};

/**
 * 获取链接信息
 * @param element DOM 元素
 * @returns 链接信息对象或 null
 */
export const getLinkInfo = (element: Element): LinkInfo | null => {
  if (element.tagName === 'A') {
    const link = element as HTMLAnchorElement;
    const href = link.href;
    const isExternal = href ? !href.startsWith(window.location.origin) : false;
    
    return {
      href: href,
      text: link.textContent?.trim() || null,
      hasText: !!(link.textContent?.trim()),
      isExternal: isExternal,
      target: link.target || null,
      ariaLabel: link.getAttribute('aria-label') || null
    };
  }
  return null;
};

/**
 * 获取标题信息
 * @param element DOM 元素
 * @returns 标题信息对象或 null
 */
export const getHeadingInfo = (element: Element): HeadingInfo | null => {
  if (/^H[1-6]$/.test(element.tagName)) {
    const level = parseInt(element.tagName.charAt(1));
    return {
      level,
      text: element.textContent?.trim() || null
    };
  }
  return null;
};

/**
 * 获取列表信息
 * @param element DOM 元素
 * @returns 列表信息对象或 null
 */
export const getListInfo = (element: Element): ListInfo | null => {
  if (element.tagName === 'UL' || element.tagName === 'OL') {
    const items = element.querySelectorAll('li');
    return {
      type: element.tagName.toLowerCase(),
      itemCount: items.length
    };
  }
  return null;
};

/**
 * 获取表格信息
 * @param element DOM 元素
 * @returns 表格信息对象或 null
 */
export const getTableInfo = (element: Element): TableInfo | null => {
  if (element.tagName === 'TABLE') {
    const table = element as HTMLTableElement;
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    const caption = table.querySelector('caption');

    return {
      hasCaption: !!caption,
      captionText: caption?.textContent?.trim() || null,
      headerCount: headers.length,
      rowCount: rows.length,
      hasHeader: !!table.querySelector('thead') || headers.length > 0
    };
  }
  return null;
};

