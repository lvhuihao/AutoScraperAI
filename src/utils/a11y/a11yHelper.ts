// ============================================
// 无障碍信息主函数 - 整合所有功能
// ============================================

import { generateSelector } from '../domHelper';
import { getImplicitRole } from './roleHelper';
import { getAccessibleName, isElementFocusable, isElementVisible, getAriaAttributes } from './elementInfoHelper';
import { getSemanticInfo } from './semanticHelper';
import {
  getFormInfo,
  getImageInfo,
  getLinkInfo,
  getHeadingInfo,
  getListInfo,
  getTableInfo,
  FormInfo,
  ImageInfo,
  LinkInfo,
  HeadingInfo,
  ListInfo,
  TableInfo
} from './elementTypeHelper';
import { getPageA11yInfo, PageA11yInfo } from './pageInfoHelper';

/**
 * 无障碍元素信息接口
 */
export interface A11yElementInfo {
  index: number;
  tagName: string;
  id: string | null;
  className: string | null;
  role: string | null;
  accessibleName: string | null;
  aria: ReturnType<typeof getAriaAttributes>;
  keyboard: {
    tabIndex: number | null;
    isFocusable: boolean;
    isKeyboardAccessible: boolean;
  };
  semantic: ReturnType<typeof getSemanticInfo>;
  form: FormInfo | null;
  image: ImageInfo | null;
  link: LinkInfo | null;
  heading: HeadingInfo | null;
  list: ListInfo | null;
  table: TableInfo | null;
  textContent: string | null;
  selector: string;
}

/**
 * 无障碍信息摘要接口
 */
export interface A11ySummary {
  totalElements: number;
  elementsWithRole: number;
  elementsWithAriaLabel: number;
  focusableElements: number;
  interactiveElements: number;
  landmarks: number;
}

/**
 * 完整页面无障碍信息接口
 */
export interface PageA11yData {
  url: string;
  timestamp: string;
  page: PageA11yInfo;
  elements: A11yElementInfo[];
  summary: A11ySummary;
}

/**
 * 检查元素是否有意义的无障碍信息
 * @param role 角色
 * @param ariaLabel ARIA 标签
 * @param ariaLabelledBy ARIA labelledby
 * @param accessibleName 可访问性名称
 * @param isFocusable 是否可聚焦
 * @param semanticInfo 语义化信息
 * @param imageInfo 图片信息
 * @param linkInfo 链接信息
 * @param headingInfo 标题信息
 * @param listInfo 列表信息
 * @param tableInfo 表格信息
 * @returns 是否有意义的无障碍信息
 */
const hasMeaningfulA11yInfo = (
  role: string | null,
  ariaLabel: string | null,
  ariaLabelledBy: string | null,
  accessibleName: string | null,
  isFocusable: boolean,
  semanticInfo: ReturnType<typeof getSemanticInfo>,
  imageInfo: ImageInfo | null,
  linkInfo: LinkInfo | null,
  headingInfo: HeadingInfo | null,
  listInfo: ListInfo | null,
  tableInfo: TableInfo | null
): boolean => {
  return !!(
    role ||
    ariaLabel ||
    ariaLabelledBy ||
    accessibleName ||
    isFocusable ||
    semanticInfo.isInteractive ||
    semanticInfo.isLandmark ||
    imageInfo ||
    linkInfo ||
    headingInfo ||
    listInfo ||
    tableInfo
  );
};

/**
 * 获取页面无障碍信息
 * @returns 完整的页面无障碍信息对象
 */
export const getPageA11y = (): PageA11yData => {
  const a11yElements: A11yElementInfo[] = [];
  const allElements = document.querySelectorAll('*');

  // 遍历所有元素，提取无障碍信息
  allElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;

    // 跳过不可见元素
    if (!isElementVisible(htmlElement)) {
      return;
    }

    // 获取元素的基本信息
    const tagName = element.tagName.toLowerCase();
    const id = element.id || null;
    const className = element.className || null;

    // 获取 ARIA 属性
    const role = element.getAttribute('role') || getImplicitRole(element);
    const ariaAttributes = getAriaAttributes(element);

    // 获取可访问性名称
    const accessibleName = getAccessibleName(element);

    // 获取键盘导航信息
    const tabIndex = element.getAttribute('tabindex');
    const isFocusable = isElementFocusable(htmlElement);

    // 获取语义化信息
    const semanticInfo = getSemanticInfo(element);

    // 获取表单关联信息
    const formInfo = getFormInfo(element);

    // 获取图片信息
    const imageInfo = getImageInfo(element);

    // 获取链接信息
    const linkInfo = getLinkInfo(element);

    // 获取标题层级信息
    const headingInfo = getHeadingInfo(element);

    // 获取列表信息
    const listInfo = getListInfo(element);

    // 获取表格信息
    const tableInfo = getTableInfo(element);

    // 只收集有意义的无障碍信息元素
    if (
      hasMeaningfulA11yInfo(
        role,
        ariaAttributes.label,
        ariaAttributes.labelledBy,
        accessibleName,
        isFocusable,
        semanticInfo,
        imageInfo,
        linkInfo,
        headingInfo,
        listInfo,
        tableInfo
      )
    ) {
      a11yElements.push({
        index,
        tagName,
        id,
        className,
        role,
        accessibleName,
        aria: ariaAttributes,
        keyboard: {
          tabIndex: tabIndex ? parseInt(tabIndex) : null,
          isFocusable,
          isKeyboardAccessible: isFocusable && !ariaAttributes.disabled
        },
        semantic: semanticInfo,
        form: formInfo,
        image: imageInfo,
        link: linkInfo,
        heading: headingInfo,
        list: listInfo,
        table: tableInfo,
        textContent: element.textContent?.trim().substring(0, 100) || null,
        selector: generateSelector(element)
      });
    }
  });

  // 获取页面级别的无障碍信息
  const pageA11y = getPageA11yInfo();

  return {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    page: pageA11y,
    elements: a11yElements,
    summary: {
      totalElements: a11yElements.length,
      elementsWithRole: a11yElements.filter(e => e.role).length,
      elementsWithAriaLabel: a11yElements.filter(e => e.aria.label).length,
      focusableElements: a11yElements.filter(e => e.keyboard.isFocusable).length,
      interactiveElements: a11yElements.filter(e => e.semantic.isInteractive).length,
      landmarks: a11yElements.filter(e => e.semantic.isLandmark).length
    }
  };
};

