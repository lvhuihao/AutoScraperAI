import { PuppeteerCore } from '../third-lib';
import { clickNodeByNodeId, type ClickOptions, type CDPSession } from './browserAction/cdpClickHelper';

const { connect, ExtensionTransport } = PuppeteerCore;

/**
 * Browser 类型（来自 Puppeteer）
 */
type Browser = {
  pages: () => Promise<Page[]>;
  disconnect: () => Promise<void>;
};

/**
 * Page 类型（来自 Puppeteer）
 */
type Page = {
  evaluate: <T>(fn: () => T) => Promise<T>;
  waitForFrame: (predicate: (frame: unknown) => boolean) => Promise<unknown>;
  waitForNetworkIdle: () => Promise<void>;
  target: () => { createCDPSession: () => Promise<CDPSession> };
};

/**
 * BrowserAction 类 - 用于通过 Puppeteer 控制浏览器
 */
export class BrowserAction {
    browser: Browser | null = null;
    url: string = '';
    tabId: number = 0;
    page: Page | null = null;

    constructor({ url }: { url: string }) {
        this.url = url;
        this.init(url);
    }

    async init(url?: string) {
        if (url) {
            this.url = url;
        }

        if (!this.url) {
            throw new Error('URL is required');
        }

        // 1. 创建新的 tab
        const tab = await chrome.tabs.create({
            url: this.url,
        });

        this.tabId = tab.id!;

        // 2. 等待新 tab 加载完成
        await new Promise<void>((resolve) => {
            function listener(tabId: number, changeInfo: chrome.tabs.TabChangeInfo) {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            }
            chrome.tabs.onUpdated.addListener(listener);
        });

        // 3. 连接到 tab
        this.browser = (await connect({
            transport: await ExtensionTransport.connectTab(tab.id!),
        })) as Browser;

        // 4. 获取页面
        const pages = await this.browser.pages();
        this.page = pages[0] as Page;

        return this;
    }

    async getPageTitle(): Promise<string> {
        if (!this.page) {
            throw new Error('Page not initialized. Call init() first.');
        }
        return await this.page.evaluate(() => {
            return document.title;
        });
    }

    /**
     * 等待满足条件的 frame
     * @param predicate 判断函数
     * @returns Promise<frame>
     */
    async waitForFrame(predicate: (frame: unknown) => boolean): Promise<unknown> {
        if (!this.page) {
            throw new Error('Page not initialized. Call init() first.');
        }
        return await this.page.waitForFrame(predicate);
    }

    async waitForNetworkIdle(): Promise<void> {
        if (!this.page) {
            throw new Error('Page not initialized. Call init() first.');
        }
        await this.page.waitForNetworkIdle();
    }

    /**
     * 在页面中执行函数
     * @param fn 要执行的函数
     * @returns Promise<T> 执行结果
     */
    async evaluate<T = unknown>(fn: () => T): Promise<T> {
        if (!this.page) {
            throw new Error('Page not initialized. Call init() first.');
        }
        return await this.page.evaluate(fn);
    }

    /**
     * 通过 CDP nodeId 模拟鼠标点击节点
     * @param nodeId Chrome DevTools Protocol 中的 nodeId
     * @param options 点击选项（可选位置，默认为节点中心）
     * @returns Promise<void>
     */
    async clickNodeByNodeId(nodeId: number, options?: ClickOptions): Promise<void> {
        if (!this.page) {
            throw new Error('Page not initialized. Call init() first.');
        }

        // 获取 CDP 客户端会话
        const client = await this.page.target().createCDPSession();
        if (!client) {
            throw new Error('CDP client not available');
        }

        await clickNodeByNodeId(client, nodeId, options);
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.disconnect();
            this.browser = null;
        }
        if (this.tabId) {
            await chrome.tabs.remove(this.tabId);
            this.tabId = 0;
        }
        this.page = null;
    }
}