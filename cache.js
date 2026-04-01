import os from 'node:os';
import path from 'node:path';
import { Browser, getInstalledBrowsers } from '@puppeteer/browsers';
import { installChromeBrowser, installFirefoxBrowser } from './installers.js';
export const PUPPETEER_CACHE_DIR = path.join(os.homedir(), '.cache', 'puppeteer');
let installedBrowsers = [];
export async function refreshInstalledBrowserCache() {
    installedBrowsers = await getInstalledBrowsers({
        cacheDir: PUPPETEER_CACHE_DIR
    });
}
export async function getCachedChromeBrowser(installIfMissing = false) {
    if (installedBrowsers.length === 0) {
        await refreshInstalledBrowserCache();
    }
    const chromeBrowser = installedBrowsers.find((browser) => browser.browser === Browser.CHROME);
    if (chromeBrowser === undefined && installIfMissing) {
        await installChromeBrowser();
        await refreshInstalledBrowserCache();
        return await getCachedChromeBrowser(false);
    }
    return chromeBrowser;
}
export async function getCachedFirefoxBrowser(installIfMissing = false) {
    if (installedBrowsers.length === 0) {
        await refreshInstalledBrowserCache();
    }
    const firefoxBrowser = installedBrowsers.find((browser) => browser.browser === Browser.FIREFOX);
    if (firefoxBrowser === undefined && installIfMissing) {
        await installFirefoxBrowser();
        await refreshInstalledBrowserCache();
        return await getCachedFirefoxBrowser(false);
    }
    return firefoxBrowser;
}
export async function getCachedBrowser(browser, installIfMissing = false) {
    return await (browser === 'chrome'
        ? getCachedChromeBrowser(installIfMissing)
        : getCachedFirefoxBrowser(installIfMissing));
}
