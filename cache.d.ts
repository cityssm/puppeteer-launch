import { type InstalledBrowser } from '@puppeteer/browsers';
export declare const PUPPETEER_CACHE_DIR: string;
/**
 * Refreshes the cache of installed browsers by re-querying the Puppeteer cache directory.
 * @returns A promise that resolves to the updated list of installed browsers.
 */
export declare function refreshInstalledBrowserCache(): Promise<InstalledBrowser[]>;
/**
 * Retrieves the cached Chrome browser from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param installIfMissing - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached Chrome browser, or undefined if not found and not installed.
 */
export declare function getCachedChromeBrowser(installIfMissing?: boolean): Promise<InstalledBrowser | undefined>;
/**
 * Retrieves the cached Firefox browser from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param installIfMissing - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached Firefox browser, or undefined if not found and not installed.
 */
export declare function getCachedFirefoxBrowser(installIfMissing?: boolean): Promise<InstalledBrowser | undefined>;
/**
 * Retrieves the cached browser for the specified browser type from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param browser - The browser type to retrieve ('chrome' or 'firefox').
 * @param installIfMissing - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached browser, or undefined if not found and not installed.
 */
export declare function getCachedBrowser(browser: 'chrome' | 'firefox', installIfMissing?: boolean): Promise<InstalledBrowser | undefined>;
