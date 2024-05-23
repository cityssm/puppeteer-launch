import { chromeWebBrowserTypes, getInstalledWebBrowsers } from '@cityssm/web-browser-info';
import Debug from 'debug';
import { launch as puppeteerLaunch } from 'puppeteer';
const debug = Debug('puppeteer-launch:index');
const defaultPuppeteerOptions = {
    timeout: 60_000,
    protocol: 'webDriverBiDi'
};
let installedWebBrowsers = [];
async function loadFallbackBrowsers() {
    if (installedWebBrowsers.length === 0) {
        const tempInstalledWebBrowsers = [];
        const fallbackChromeBrowsers = await getInstalledWebBrowsers(chromeWebBrowserTypes, 110);
        tempInstalledWebBrowsers.push(...fallbackChromeBrowsers);
        const fallbackFirefoxBrowsers = await getInstalledWebBrowsers('firefox');
        tempInstalledWebBrowsers.push(...fallbackFirefoxBrowsers);
        installedWebBrowsers = tempInstalledWebBrowsers;
        if (tempInstalledWebBrowsers.length === 0) {
            throw new Error('No fallback system browsers available.');
        }
        else {
            debug('Available fallback browsers:');
            debug(tempInstalledWebBrowsers);
        }
    }
    return installedWebBrowsers;
}
export default async function launch(options) {
    const puppeteerOptions = Object.assign({}, defaultPuppeteerOptions, options);
    try {
        return await puppeteerLaunch(puppeteerOptions);
    }
    catch (error) {
        debug('Switching to fallback browsers');
        const fallbackOptions = await loadFallbackBrowsers();
        for (const fallback of fallbackOptions) {
            if ((options?.product === 'firefox' && fallback.type !== 'firefox') ||
                (options?.product === 'chrome' &&
                    !chromeWebBrowserTypes.includes(fallback.type))) {
                continue;
            }
            try {
                const browser = await puppeteerLaunch(Object.assign({}, puppeteerOptions, {
                    project: fallback.type === 'firefox' ? 'firefox' : 'chrome',
                    executablePath: fallback.command
                }));
                debug('Launched browser');
                debug(fallback);
                return browser;
            }
            catch {
                debug(`Error launching browser: ${fallback.command}`);
            }
        }
        throw error;
    }
}
export * as puppeteer from 'puppeteer';
