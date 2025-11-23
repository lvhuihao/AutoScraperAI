// ============================================
// Snapshot 格式化器
// ============================================

import { TextSnapshotNode, TextSnapshot } from './types';

/**
 * 获取节点的属性列表
 * @param serializedAXNodeRoot 序列化的 AX 节点根节点
 * @returns 属性字符串数组
 */
const getAttributes = (serializedAXNodeRoot: TextSnapshotNode): string[] => {
  const attributes = [`uid=${serializedAXNodeRoot.id}`];
  if (serializedAXNodeRoot.role) {
    // To match representation in DevTools.
    attributes.push(
      serializedAXNodeRoot.role === 'none'
        ? 'ignored'
        : serializedAXNodeRoot.role
    );
  }
  if (serializedAXNodeRoot.name) {
    attributes.push(`"${serializedAXNodeRoot.name}"`);
  }

  const excluded = new Set([
    'id',
    'role',
    'name',
    'elementHandle',
    'children',
    'backendNodeId'
  ]);

  const booleanPropertyMap: Record<string, string> = {
    disabled: 'disableable',
    expanded: 'expandable',
    focused: 'focusable',
    selected: 'selectable'
  };

  for (const attr of Object.keys(serializedAXNodeRoot).sort()) {
    if (excluded.has(attr)) {
      continue;
    }
    const value = (serializedAXNodeRoot as unknown as Record<string, unknown>)[attr];
    if (typeof value === 'boolean') {
      if (booleanPropertyMap[attr]) {
        attributes.push(booleanPropertyMap[attr]);
      }
      if (value) {
        attributes.push(attr);
      }
    } else if (typeof value === 'string' || typeof value === 'number') {
      attributes.push(`${attr}="${value}"`);
    }
  }
  return attributes;
};

/**
 * 格式化 Snapshot 节点为字符串
 * @param root 根节点
 * @param snapshot 快照对象（可选）
 * @param depth 当前深度（默认 0）
 * @returns 格式化后的字符串
 */
export const formatSnapshotNode = (
  root: TextSnapshotNode,
  snapshot?: TextSnapshot,
  depth = 0
): string => {
  let result = '';
  const attributes = getAttributes(root);
  const line =
    ' '.repeat(depth * 2) +
    attributes.join(' ') +
    (root.id === (snapshot as { selectedElementUid?: string })?.selectedElementUid
      ? ' [selected in the DevTools Elements panel]'
      : '') +
    '\n';
  result += line;

  for (const child of root.children) {
    result += formatSnapshotNode(child, snapshot, depth + 1);
  }

  return result;
};

