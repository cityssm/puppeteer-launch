import type { Browser } from 'puppeteer';
import { type LaunchOptionsWithBrowserOrder } from './index.js';
/**
 * A singleton class that manages a global Puppeteer browser instance.
 * It ensures that only one browser instance is active at a time.
 * The browser instance will automatically close after a specified idle time.
 */
export declare class GlobalBrowser {
    #private;
    /**
     * Creates a new instance of the GlobalBrowser class.
     * @param browserOptions - Optional launch parameters for the Puppeteer browser.
     * @param idleMillis - The time in milliseconds after which the browser will automatically close if idle.
     * Defaults to 60,000 ms (1 minute).
     */
    constructor(browserOptions?: LaunchOptionsWithBrowserOrder, idleMillis?: number);
    /**
     * Closes the global Puppeteer browser instance if open.
     */
    closeBrowser(): Promise<void>;
    /**
     * Acquires the global Puppeteer browser instance.
     * If the browser is not already open, it will launch a new instance.
     * The caller must release the browser when done.
     * @param wait - Whether to wait for the browser to become available if in use. Defaults to `true`.
     * @returns The global Puppeteer browser instance.
     */
    getBrowser(wait?: boolean): Promise<Browser>;
    /**
     * Releases the global Puppeteer browser instance.
     */
    releaseBrowser(): Promise<void>;
}
