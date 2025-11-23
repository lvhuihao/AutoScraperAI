// ============================================
// DOM 操作相关工具函数
// ============================================

import { sleep } from './common';

/**
 * 生成元素选择器
 * @param element DOM 元素
 * @returns CSS 选择器字符串
 */
export const generateSelector = (element: Element): string => {
  if (element.id) {
    return `#${element.id}`;
  }
  
  let selector = element.tagName.toLowerCase();
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c).join('.');
    if (classes) {
      selector += `.${classes}`;
    }
  }
  
  // 添加父级信息以提高唯一性
  const parent = element.parentElement;
  if (parent) {
    const parentSelector = generateSelector(parent);
    return `${parentSelector} > ${selector}`;
  }
  
  return selector;
};

/**
 * 点击元素
 * @param selector CSS 选择器
 * @returns 是否成功
 */
export const clickElement = async (selector: string): Promise<boolean> => {
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`未找到元素: ${selector}`);
    return false;
  }
  
  // 滚动到元素可见
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await sleep(300);
  
  // 点击
  (element as HTMLElement).click();
  return true;
};

/**
 * 滚动页面
 * @param direction 滚动方向 ('down' | 'up')
 * @param amount 滚动距离
 * @returns 是否成功
 */
export const scrollPage = async (direction: string, amount: number = 500): Promise<boolean> => {
  const scrollAmount = direction === 'down' ? amount : -amount;
  window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  await sleep(500);
  return true;
};

/**
 * 输入文本
 * @param selector CSS 选择器
 * @param text 要输入的文本
 * @returns 是否成功
 */
export const inputText = async (selector: string, text: string): Promise<boolean> => {
  const element = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
  if (!element) {
    console.error(`未找到元素: ${selector}`);
    return false;
  }
  
  element.focus();
  await sleep(100);
  element.value = text;
  
  // 触发输入事件
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  
  return true;
};

