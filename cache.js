import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { debuglog } from 'node:util';
import { Browser, getInstalledBrowsers } from '@puppeteer/browsers';
import { DEBUG_NAMESPACE } from './debug.config.js';
import { installChromeBrowser, installFirefoxBrowser } from './installers.js';
const debug = debuglog(`${DEBUG_NAMESPACE}:cache`);
export const PUPPETEER_CACHE_DIRECTORIES = [
    path.join(process.cwd(), '.cache', 'puppeteer'),
    path.join(import.meta.dirname, '.cache', 'puppeteer'),
    path.join(os.homedir(), '.cache', 'puppeteer')
];
export const PUPPETEER_CACHE_DIR = PUPPETEER_CACHE_DIRECTORIES.find((cacheDirectory) => fs.existsSync(cacheDirectory));
const cache = {
    installedBrowsers: []
};
/**
 * Refreshes the cache of installed browsers by re-querying the Puppeteer cache directory.
 * @returns A promise that resolves to the updated list of installed browsers.
 */
export async function refreshInstalledBrowserCache() {
    if (PUPPETEER_CACHE_DIR === undefined ||
        !fs.existsSync(PUPPETEER_CACHE_DIR)) {
        debug('Cache directory does not exist: %s', PUPPETEER_CACHE_DIR);
        return [];
    }
    let tempInstalledBrowsers = await getInstalledBrowsers({
        cacheDir: PUPPETEER_CACHE_DIR
    });
    // Filter out browsers with missing executable paths
    tempInstalledBrowsers = tempInstalledBrowsers.filter((browser) => fs.existsSync(browser.executablePath) &&
        fs.statSync(browser.executablePath).isFile());
    cache.installedBrowsers = tempInstalledBrowsers;
    debug('Refreshed installed browser cache: %O', cache.installedBrowsers);
    return cache.installedBrowsers;
}
/**
 * Retrieves the cached Chrome browser from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param shouldInstallIfNotFound - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached Chrome browser, or undefined if not found and not installed.
 */
export async function getCachedChromeBrowser(shouldInstallIfNotFound = false) {
    if (cache.installedBrowsers.length === 0) {
        await refreshInstalledBrowserCache();
    }
    const chromeBrowser = cache.installedBrowsers.findLast((browser) => browser.browser === Browser.CHROME);
    if (chromeBrowser === undefined && shouldInstallIfNotFound) {
        await installChromeBrowser();
        await refreshInstalledBrowserCache();
        return await getCachedChromeBrowser(false);
    }
    return chromeBrowser;
}
/**
 * Retrieves the cached Firefox browser from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param shouldInstallIfNotFound - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached Firefox browser, or undefined if not found and not installed.
 */
export async function getCachedFirefoxBrowser(shouldInstallIfNotFound = false) {
    if (cache.installedBrowsers.length === 0) {
        await refreshInstalledBrowserCache();
    }
    const firefoxBrowser = cache.installedBrowsers.findLast((browser) => browser.browser === Browser.FIREFOX);
    if (firefoxBrowser === undefined && shouldInstallIfNotFound) {
        await installFirefoxBrowser();
        await refreshInstalledBrowserCache();
        return await getCachedFirefoxBrowser(false);
    }
    return firefoxBrowser;
}
/**
 * Retrieves the cached browser for the specified browser type from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param browser - The browser type to retrieve ('chrome' or 'firefox').
 * @param shouldInstallIfNotFound - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached browser, or undefined if not found and not installed.
 */
export async function getCachedBrowser(browser, shouldInstallIfNotFound = false) {
    return browser === 'chrome'
        ? await getCachedChromeBrowser(shouldInstallIfNotFound)
        : await getCachedFirefoxBrowser(shouldInstallIfNotFound);
}
