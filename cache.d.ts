import { type InstalledBrowser } from '@puppeteer/browsers';
export declare const PUPPETEER_CACHE_DIR: string;
export declare function refreshInstalledBrowserCache(): Promise<void>;
export declare function getCachedChromeBrowser(installIfMissing?: boolean): Promise<InstalledBrowser | undefined>;
export declare function getCachedFirefoxBrowser(installIfMissing?: boolean): Promise<InstalledBrowser | undefined>;
export declare function getCachedBrowser(browser: 'chrome' | 'firefox', installIfMissing?: boolean): Promise<InstalledBrowser | undefined>;
