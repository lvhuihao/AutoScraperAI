// ============================================
// 无障碍信息相关工具函数 - 向后兼容导出
// ============================================
// 此文件用于保持向后兼容，实际实现已拆分到 a11y 子目录

// 重新导出所有函数以保持向后兼容
export { getPageA11y } from './a11y/a11yHelper';
export { getImplicitRole, getInputRole } from './a11y/roleHelper';
export {
  getAccessibleName,
  isElementFocusable,
  isElementVisible,
  getAriaAttributes
} from './a11y/elementInfoHelper';
export { getSemanticInfo } from './a11y/semanticHelper';
export {
  getFormInfo,
  getImageInfo,
  getLinkInfo,
  getHeadingInfo,
  getListInfo,
  getTableInfo,
  type FormInfo,
  type ImageInfo,
  type LinkInfo,
  type HeadingInfo,
  type ListInfo,
  type TableInfo
} from './a11y/elementTypeHelper';
export {
  getHeadingStructure,
  getLandmarks,
  getPageA11yInfo,
  type HeadingStructureItem,
  type LandmarkItem,
  type PageA11yInfo
} from './a11y/pageInfoHelper';
