// ============================================
// Snapshot Formatter - 向后兼容导出
// ============================================
// 此文件用于保持向后兼容，实际实现已拆分到 snapshot 子目录

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// 重新导出所有函数以保持向后兼容
export { convertCDPAXTreeToSnapshotNode } from './snapshot/converter';
export { formatSnapshotNode } from './snapshot/formatter';
export type { TextSnapshotNode, CDPAXTree, CDPAXNode } from './snapshot/types';
