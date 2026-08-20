import { type Browser, type LaunchOptions } from 'puppeteer';
type RetryBrowser = 'chrome-user' | 'chrome' | 'firefox-user' | 'firefox';
export type LaunchOptionsWithBrowserOrder = LaunchOptions & {
    browserOrder?: RetryBrowser[];
};
export declare const browserOrderDefault: RetryBrowser[];
/**
 * Launches a Puppeteer browser instance.
 * Automatically falls back to a system browser if no browser is available in the Puppeteer cache.
 * @param options - Optional launch parameters
 * @returns - A Puppeteer browser instance.
 */
export default function launch(options?: LaunchOptionsWithBrowserOrder): Promise<Browser>;
export { getCachedBrowser, getCachedChromeBrowser, getCachedFirefoxBrowser, refreshInstalledBrowserCache } from './cache.js';
export { installBrowser, installChromeBrowser, installFirefoxBrowser, testInstalledBrowser, testInstalledChromeBrowser, testInstalledFirefoxBrowser } from './installers.js';
export * as puppeteer from 'puppeteer';
