// ============================================
// Snapshot 类型定义
// ============================================

/**
 * TextSnapshot 类型（占位符，实际类型可能在其他地方定义）
 */
export type TextSnapshot = unknown;

/**
 * TextSnapshotNode 接口
 */
export interface TextSnapshotNode {
  id: string;
  role: string;
  name?: string;
  value?: string;
  description?: string;
  backendNodeId?: number;
  children: TextSnapshotNode[];
  elementHandle: () => Promise<unknown>;
  [key: string]: unknown;
}

/**
 * CDP AX 节点接口
 */
export interface CDPAXNode {
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
export interface CDPAXTree {
  nodes: CDPAXNode[];
}

