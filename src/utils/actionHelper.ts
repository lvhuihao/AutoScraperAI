// ============================================
// 操作执行相关工具函数
// ============================================

import { sleep } from './common';
import { clickElement, scrollPage, inputText } from './domHelper';

/**
 * 操作类型定义
 */
export type ActionType = 'click' | 'scroll' | 'input' | 'wait';

/**
 * 操作对象接口
 */
export interface Action {
  type: ActionType;
  selector?: string;
  direction?: string;
  amount?: number;
  text?: string;
}

/**
 * 执行单个操作
 * @param action 操作对象
 * @returns 是否成功
 */
export const executeAction = async (action: Action): Promise<boolean> => {
  try {
    switch (action.type) {
      case 'click':
        if (!action.selector) {
          console.warn('点击操作缺少 selector');
          return false;
        }
        return await clickElement(action.selector);
      
      case 'scroll':
        if (!action.direction) {
          console.warn('滚动操作缺少 direction');
          return false;
        }
        return await scrollPage(action.direction, action.amount);
      
      case 'input':
        if (!action.selector || !action.text) {
          console.warn('输入操作缺少 selector 或 text');
          return false;
        }
        return await inputText(action.selector, action.text);
      
      case 'wait':
        await sleep(action.amount || 1000);
        return true;
      
      default:
        console.warn('未知的操作类型:', action.type);
        return false;
    }
  } catch (error) {
    console.error('执行操作失败:', error);
    return false;
  }
};

/**
 * 执行操作列表
 * @param actions 操作数组
 * @param delayBetweenActions 操作之间的延迟（毫秒）
 * @returns 执行结果数组
 */
export const executeActions = async (
  actions: Action[],
  delayBetweenActions: number = 200
): Promise<boolean[]> => {
  const results: boolean[] = [];
  
  for (const action of actions) {
    const result = await executeAction(action);
    results.push(result);
    // 操作之间稍作延迟
    if (delayBetweenActions > 0) {
      await sleep(delayBetweenActions);
    }
  }
  
  return results;
};

