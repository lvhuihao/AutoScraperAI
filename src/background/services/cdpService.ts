// ============================================
// CDP 服务 - 通过 Chrome DevTools Protocol 获取无障碍信息
// ============================================

import { getActiveTab, validateTab } from '../../utils/tabHelper';
import { convertCDPAXTreeToSnapshotNode, formatSnapshotNode } from '../snapshotFormatter';
import { PageA11yResult } from '../types';

/**
 * CDP AX 节点接口
 */
interface CDPAXNode {
  nodeId: string;
  ignored?: boolean;
  role?: { type: string; value: string } | string;
  chromeRole?: string;
  name?: { type: string; value: string } | string;
  description?: { type: string; value: string } | string;
  value?: { type: string; value: string | number } | string | number;
  properties?: Array<{
    name: string;
    value: { type: string; value: unknown };
  }>;
  parentId?: string;
  childIds?: string[];
  backendDOMNodeId?: number;
  [key: string]: unknown;
}

/**
 * CDP AX 树接口
 */
interface CDPAXTree {
  nodes: CDPAXNode[];
}

/**
 * 附加 Chrome Debugger
 * @param tabId 标签页 ID
 * @returns Promise<void>
 */
const attachDebugger = async (tabId: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    chrome.debugger.attach({ tabId }, '1.3', () => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
      } else {
        resolve();
      }
    });
  });
};

/**
 * 启用 Accessibility 域
 * @param tabId 标签页 ID
 * @returns Promise<void>
 */
const enableAccessibilityDomain = async (tabId: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    chrome.debugger.sendCommand(
      { tabId },
      'Accessibility.enable',
      {},
      () => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
        } else {
          resolve();
        }
      }
    );
  });
};

/**
 * 获取完整的 a11y 树
 * @param tabId 标签页 ID
 * @returns Promise<CDPAXTree>
 */
const getFullAXTree = async (tabId: number): Promise<CDPAXTree> => {
  return new Promise<CDPAXTree>((resolve, reject) => {
    chrome.debugger.sendCommand(
      { tabId },
      'Accessibility.getFullAXTree',
      {},
      (result) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
        } else {
          resolve(result as CDPAXTree);
        }
      }
    );
  });
};

/**
 * 分离调试器
 * @param tabId 标签页 ID
 * @returns Promise<void>
 */
const detachDebugger = async (tabId: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.debugger.detach({ tabId }, () => {
      resolve();
    });
  });
};

/**
 * 通过 Chrome DevTools Protocol (CDP) 获取页面无障碍信息
 * @returns 页面无障碍信息结果
 */
export const getPageA11yByChrome = async (): Promise<PageA11yResult> => {
  let tabId: number | null = null;
  let isAttached = false;

  try {
    // 1. 获取当前活动的标签页
    const tab = await getActiveTab();
    const validation = validateTab(tab);

    if (!validation.valid) {
      return { success: false, error: validation.error || '无法获取标签页' };
    }

    if (!tab || !tab.id) {
      return { success: false, error: '无法获取标签页 ID' };
    }

    tabId = tab.id;

    // 2. 附加 Chrome Debugger
    try {
      await attachDebugger(tabId);
      isAttached = true;
    } catch (attachError) {
      return {
        success: false,
        error: `无法附加调试器: ${attachError instanceof Error ? attachError.message : '未知错误'}`
      };
    }

    // 3. 启用 Accessibility 域
    try {
      await enableAccessibilityDomain(tabId);
    } catch (enableError) {
      await detachDebugger(tabId);
      return {
        success: false,
        error: `无法启用 Accessibility 域: ${enableError instanceof Error ? enableError.message : '未知错误'}`
      };
    }

    // 4. 获取完整的 a11y 树
    let axTree: CDPAXTree;
    try {
      axTree = await getFullAXTree(tabId);
    } catch (getTreeError) {
      await detachDebugger(tabId);
      return {
        success: false,
        error: `无法获取 a11y 树: ${getTreeError instanceof Error ? getTreeError.message : '未知错误'}`
      };
    }

    // 5. 分离调试器
    try {
      await detachDebugger(tabId);
      isAttached = false;
    } catch (detachError) {
      console.error('分离调试器时出错:', detachError);
    }

    // 6. 处理并返回 a11y 树数据
    if (axTree && axTree.nodes) {
      // 转换 CDP 格式的 a11y 树为更易读的格式
      const processedData = {
        url: tab.url || '',
        timestamp: new Date().toISOString(),
        axTree: formatSnapshotNode(convertCDPAXTreeToSnapshotNode(axTree)),
        nodeCount: axTree.nodes?.length || 0
      };

      console.log('axTree');
      console.log(axTree);

      return {
        success: true,
        data: processedData,
        method: 'CDP'
      };
    } else {
      return {
        success: false,
        error: '获取到的 a11y 树数据为空'
      };
    }
  } catch (error) {
    console.error('通过 CDP 获取无障碍信息时出错:', error);

    // 确保在出错时也分离调试器
    if (isAttached && tabId !== null) {
      try {
        await detachDebugger(tabId);
      } catch (cleanupError) {
        console.error('清理调试器时出错:', cleanupError);
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

