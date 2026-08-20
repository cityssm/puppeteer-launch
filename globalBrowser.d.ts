import type { Browser } from 'puppeteer';
import { type LaunchOptionsWithBrowserOrder } from './index.js';
export declare class GlobalBrowser {
    #private;
    constructor(browserOptions?: LaunchOptionsWithBrowserOrder, idleMillis?: number);
    closeBrowser(): Promise<void>;
    getBrowser(wait?: boolean): Promise<Browser>;
    releaseBrowser(): Promise<void>;
}
