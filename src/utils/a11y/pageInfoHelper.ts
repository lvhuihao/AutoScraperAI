// ============================================
// 页面级别无障碍信息相关工具函数
// ============================================

/**
 * 标题结构项接口
 */
export interface HeadingStructureItem {
  level: number;
  text: string;
  id: string | null;
}

/**
 * 地标元素接口
 */
export interface LandmarkItem {
  type: string;
  role: string | null;
  text: string;
  id: string | null;
}

/**
 * 页面级别无障碍信息接口
 */
export interface PageA11yInfo {
  lang: string | null;
  title: string;
  hasMain: boolean;
  hasNav: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  hasHeading: boolean;
  headingStructure: HeadingStructureItem[];
  landmarks: LandmarkItem[];
  formCount: number;
  linkCount: number;
  imageCount: number;
  imageWithAltCount: number;
  imageWithoutAltCount: number;
  interactiveElementCount: number;
}

/**
 * 获取标题结构
 * @returns 标题结构数组
 */
export const getHeadingStructure = (): HeadingStructureItem[] => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  return headings.map(heading => ({
    level: parseInt(heading.tagName.charAt(1)),
    text: heading.textContent?.trim() || '',
    id: heading.id || null
  }));
};

/**
 * 获取地标元素
 * @returns 地标元素数组
 */
export const getLandmarks = (): LandmarkItem[] => {
  const landmarks: LandmarkItem[] = [];

  // 语义化地标
  const semanticLandmarks = ['main', 'nav', 'header', 'footer', 'aside', 'article', 'section'];
  semanticLandmarks.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    elements.forEach(el => {
      landmarks.push({
        type: tag,
        role: null,
        text: el.textContent?.trim().substring(0, 50) || '',
        id: el.id || null
      });
    });
  });

  // ARIA 地标
  const ariaLandmarks = document.querySelectorAll(
    '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="article"], [role="region"]'
  );
  ariaLandmarks.forEach(el => {
    const role = el.getAttribute('role');
    if (role && !semanticLandmarks.includes(el.tagName.toLowerCase())) {
      landmarks.push({
        type: el.tagName.toLowerCase(),
        role: role,
        text: el.textContent?.trim().substring(0, 50) || '',
        id: el.id || null
      });
    }
  });

  return landmarks;
};

/**
 * 获取页面级别的无障碍信息
 * @returns 页面级别的无障碍信息对象
 */
export const getPageA11yInfo = (): PageA11yInfo => {
  return {
    lang: document.documentElement.lang || null,
    title: document.title,
    hasMain: !!document.querySelector('main, [role="main"]'),
    hasNav: !!document.querySelector('nav, [role="navigation"]'),
    hasHeader: !!document.querySelector('header, [role="banner"]'),
    hasFooter: !!document.querySelector('footer, [role="contentinfo"]'),
    hasHeading: !!document.querySelector('h1, h2, h3, h4, h5, h6'),
    headingStructure: getHeadingStructure(),
    landmarks: getLandmarks(),
    formCount: document.querySelectorAll('form').length,
    linkCount: document.querySelectorAll('a[href]').length,
    imageCount: document.querySelectorAll('img').length,
    imageWithAltCount: document.querySelectorAll('img[alt]').length,
    imageWithoutAltCount: document.querySelectorAll('img:not([alt])').length,
    interactiveElementCount: document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]').length
  };
};

