// ============================================
// CDP 点击操作辅助函数
// ============================================

/**
 * CDP Session 类型
 */
export interface CDPSession {
  send: (method: string, params?: unknown) => Promise<unknown>;
  detach: () => Promise<void>;
}

/**
 * 点击选项接口
 */
export interface ClickOptions {
  x?: number;
  y?: number;
  button?: 'left' | 'right' | 'middle';
  clickCount?: number;
}

/**
 * 通过 CDP nodeId 模拟鼠标点击节点
 * @param client CDP 客户端会话
 * @param nodeId Chrome DevTools Protocol 中的 nodeId
 * @param options 点击选项（可选位置，默认为节点中心）
 * @returns Promise<void>
 */
export const clickNodeByNodeId = async (
  client: CDPSession,
  nodeId: number,
  options?: ClickOptions
): Promise<void> => {
  try {
    // 1. 启用必要的 CDP 域
    await client.send('DOM.enable');
    await client.send('Input.enable');

    // 2. 获取节点信息（验证节点存在）
    const describeNodeResult = (await client.send('DOM.describeNode', {
      nodeId: nodeId
    })) as { node?: unknown } | null;

    if (!describeNodeResult || !describeNodeResult.node) {
      throw new Error(`Node with nodeId ${nodeId} not found`);
    }

    // 3. 获取节点的边界框（bounding box）
    const boxModelResult = (await client.send('DOM.getBoxModel', {
      nodeId: nodeId
    })) as { model?: { content?: number[] } } | null;

    if (!boxModelResult || !boxModelResult.model || !boxModelResult.model.content) {
      throw new Error(`Failed to get box model for nodeId ${nodeId}`);
    }

    // 4. 计算点击坐标
    const { x, y } = calculateClickCoordinates(
      boxModelResult.model.content,
      options
    );

    // 5. 确定鼠标按钮
    const mouseButton = getMouseButton(options?.button);

    // 6. 获取点击次数
    const clickCount = options?.clickCount || 1;

    // 7. 发送鼠标事件序列
    await sendMouseEvents(client, x, y, mouseButton, clickCount);
  } catch (error) {
    throw new Error(
      `Failed to click node with nodeId ${nodeId}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  } finally {
    // 清理：禁用域并分离客户端
    try {
      await client.send('DOM.disable');
      await client.send('Input.disable');
      await client.detach();
    } catch (cleanupError) {
      console.error('Error during CDP cleanup:', cleanupError);
    }
  }
};

/**
 * 计算点击坐标
 * @param content 边界框内容数组 [x1, y1, x2, y2, x3, y3, x4, y4]
 * @param options 点击选项
 * @returns 点击坐标 {x, y}
 */
const calculateClickCoordinates = (
  content: number[],
  options?: ClickOptions
): { x: number; y: number } => {
  if (options?.x !== undefined && options?.y !== undefined) {
    // 如果提供了坐标，使用提供的坐标
    return { x: options.x, y: options.y };
  }

  // 否则计算中心点
  // content[0], content[1] 是左上角
  // content[4], content[5] 是右下角
  const left = content[0];
  const top = content[1];
  const right = content[4];
  const bottom = content[5];
  return {
    x: Math.round((left + right) / 2),
    y: Math.round((top + bottom) / 2)
  };
};

/**
 * 获取鼠标按钮类型
 * @param button 按钮选项
 * @returns 鼠标按钮类型
 */
const getMouseButton = (button?: 'left' | 'right' | 'middle'): 'left' | 'right' | 'middle' => {
  const buttonMap: Record<string, 'left' | 'right' | 'middle'> = {
    left: 'left',
    right: 'right',
    middle: 'middle'
  };
  return buttonMap[button || 'left'] || 'left';
};

/**
 * 发送鼠标事件序列
 * @param client CDP 客户端会话
 * @param x X 坐标
 * @param y Y 坐标
 * @param button 鼠标按钮
 * @param clickCount 点击次数
 */
const sendMouseEvents = async (
  client: CDPSession,
  x: number,
  y: number,
  button: 'left' | 'right' | 'middle',
  clickCount: number
): Promise<void> => {
  // 首先移动到目标位置
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: x,
    y: y
  });

  // 然后发送鼠标按下事件
  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: x,
    y: y,
    button: button,
    clickCount: clickCount
  });

  // 最后发送鼠标释放事件
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: x,
    y: y,
    button: button,
    clickCount: clickCount
  });
};

