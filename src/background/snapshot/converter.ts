// ============================================
// CDP 到 Snapshot 转换器
// ============================================

import { CDPAXTree, CDPAXNode, TextSnapshotNode } from './types';

/**
 * 从 CDP 的值对象中提取实际值
 * CDP 的值可能是对象 {type, value} 或直接值
 * @param value CDP 值对象或直接值
 * @returns 提取的实际值
 */
const extractValue = (
  value:
    | { type: string; value: unknown }
    | string
    | number
    | boolean
    | undefined
    | null
): string | number | boolean | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  // 如果是对象，提取 value 属性
  if (typeof value === 'object' && 'value' in value) {
    return value.value as string | number | boolean;
  }

  // 直接返回值
  return value;
};

/**
 * 将单个 CDP 节点转换为 TextSnapshotNode
 * @param cdpNode CDP 节点
 * @param nodeMap 节点映射表
 * @param snapshotId 快照 ID
 * @param idCounterMap ID 计数器映射
 * @param startCounter 起始计数器
 * @returns 转换后的 TextSnapshotNode
 */
const convertCDPNodeToSnapshotNode = (
  cdpNode: CDPAXNode,
  nodeMap: Map<string, CDPAXNode>,
  snapshotId: string,
  idCounterMap: Map<string, number>,
  startCounter = 1
): TextSnapshotNode => {
  // 获取或创建计数器
  if (!idCounterMap.has(snapshotId)) {
    idCounterMap.set(snapshotId, startCounter);
  }
  const currentCounter = idCounterMap.get(snapshotId)!;
  const nodeId = `${snapshotId}_${currentCounter}`;
  idCounterMap.set(snapshotId, currentCounter + 1);

  // 提取基本属性
  const roleValue = extractValue(cdpNode.role);
  const nameValue = extractValue(cdpNode.name);
  const valueValue = extractValue(cdpNode.value);
  const descriptionValue = extractValue(cdpNode.description);

  // 构建节点对象
  const snapshotNode: TextSnapshotNode = {
    id: nodeId,
    role:
      typeof roleValue === 'string'
        ? roleValue
        : cdpNode.ignored
          ? 'none'
          : 'generic',
    name: typeof nameValue === 'string' ? nameValue : undefined,
    value:
      valueValue !== undefined
        ? typeof valueValue === 'string' || typeof valueValue === 'number'
          ? String(valueValue)
          : undefined
        : undefined,
    description:
      typeof descriptionValue === 'string' ? descriptionValue : undefined,
    backendNodeId: cdpNode.backendDOMNodeId,
    children: [],
    elementHandle: async () => null
  };

  // 处理 properties 数组，将其展开为节点属性
  if (cdpNode.properties && Array.isArray(cdpNode.properties)) {
    for (const prop of cdpNode.properties) {
      const propValue = extractValue(prop.value);
      if (propValue !== undefined) {
        // 将属性名转换为驼峰命名（如果需要）
        const propName = prop.name;
        const snapshotNodeAny = snapshotNode as unknown as Record<string, unknown>;
        const existingValue = snapshotNodeAny[propName];

        // 处理布尔值属性
        if (typeof propValue === 'boolean') {
          snapshotNodeAny[propName] = propValue;
        } else if (typeof propValue === 'string' || typeof propValue === 'number') {
          // 对于字符串和数字，直接设置
          snapshotNodeAny[propName] = propValue;
        } else if (existingValue === undefined) {
          // 其他类型转换为字符串
          snapshotNodeAny[propName] = String(propValue);
        }
      }
    }
  }

  // 处理子节点
  if (cdpNode.childIds && Array.isArray(cdpNode.childIds)) {
    snapshotNode.children = cdpNode.childIds
      .map(childId => {
        const childNode = nodeMap.get(childId);
        if (!childNode) {
          return null;
        }
        return convertCDPNodeToSnapshotNode(
          childNode,
          nodeMap,
          snapshotId,
          idCounterMap
        );
      })
      .filter((node): node is TextSnapshotNode => node !== null);
  }

  // 特殊处理：如果 role 是 'option'，使用 name 作为 value
  if (
    typeof roleValue === 'string' &&
    roleValue === 'option' &&
    typeof nameValue === 'string' &&
    !snapshotNode.value
  ) {
    snapshotNode.value = nameValue;
  }

  return snapshotNode;
};

/**
 * 从 CDP 的 a11y 树转换为 TextSnapshotNode 格式
 * @param cdpAxTree CDP Accessibility.getFullAXTree 返回的树结构
 * @param snapshotId 快照 ID，用于生成节点 ID（可选，默认为 'cdp'）
 * @returns 转换后的 TextSnapshotNode 根节点
 */
export const convertCDPAXTreeToSnapshotNode = (
  cdpAxTree: CDPAXTree,
  snapshotId = 'cdp'
): TextSnapshotNode => {
  const { nodes } = cdpAxTree;
  if (!nodes || nodes.length === 0) {
    throw new Error('CDP AX tree has no nodes');
  }

  // 创建节点映射表
  const nodeMap = new Map<string, CDPAXNode>();
  nodes.forEach(node => {
    nodeMap.set(node.nodeId, node);
  });

  // 找到根节点（没有 parentId 的节点）
  const rootNodes = nodes.filter(node => !node.parentId);
  if (rootNodes.length === 0) {
    // 如果没有明确的根节点，使用第一个节点
    const firstNode = nodes[0];
    return convertCDPNodeToSnapshotNode(
      firstNode,
      nodeMap,
      snapshotId,
      new Map()
    );
  }

  // 如果有多个根节点，创建一个虚拟根节点
  if (rootNodes.length > 1) {
    const virtualRoot: TextSnapshotNode = {
      id: `${snapshotId}_0`,
      role: 'root',
      children: rootNodes.map((node, index) =>
        convertCDPNodeToSnapshotNode(
          node,
          nodeMap,
          snapshotId,
          new Map(),
          index + 1
        )
      ),
      elementHandle: async () => null
    };
    return virtualRoot;
  }

  // 单个根节点
  return convertCDPNodeToSnapshotNode(
    rootNodes[0],
    nodeMap,
    snapshotId,
    new Map()
  );
};

