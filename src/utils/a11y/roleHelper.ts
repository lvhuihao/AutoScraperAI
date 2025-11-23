// ============================================
// 无障碍角色相关工具函数
// ============================================

/**
 * 获取隐式角色
 * @param element DOM 元素
 * @returns 角色名称或 null
 */
export const getImplicitRole = (element: Element): string | null => {
  const tagName = element.tagName.toLowerCase();
  const roleMap: Record<string, string | null> = {
    a: element.getAttribute('href') ? 'link' : null,
    button: 'button',
    input: element instanceof HTMLInputElement ? getInputRole(element) : 'textbox',
    select: 'combobox',
    textarea: 'textbox',
    img: 'img',
    nav: 'navigation',
    main: 'main',
    article: 'article',
    section: 'region',
    aside: 'complementary',
    header: 'banner',
    footer: 'contentinfo',
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    h5: 'heading',
    h6: 'heading',
    ul: 'list',
    ol: 'list',
    li: 'listitem',
    table: 'table',
    th: 'columnheader',
    td: 'cell',
    form: 'form'
  };
  return roleMap[tagName] || null;
};

/**
 * 获取输入元素的角色
 * @param input 输入元素
 * @returns 角色名称
 */
export const getInputRole = (input: HTMLInputElement): string | null => {
  // 防御性检查：确保 type 属性存在
  if (!input || !input.type) {
    return 'textbox'; // 默认返回 textbox
  }

  const type = input.type.toLowerCase();
  const roleMap: Record<string, string> = {
    button: 'button',
    checkbox: 'checkbox',
    radio: 'radio',
    range: 'slider',
    submit: 'button',
    reset: 'button',
    image: 'button',
    text: 'textbox',
    email: 'textbox',
    password: 'textbox',
    search: 'searchbox',
    tel: 'textbox',
    url: 'textbox'
  };
  return roleMap[type] || 'textbox';
};

