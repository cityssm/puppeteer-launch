import { chromeWebBrowserTypes, getInstalledWebBrowsers } from '@cityssm/web-browser-info';
import Debug from 'debug';
import * as puppeteer from 'puppeteer';
const debug = Debug('puppeteer-launch');
const defaultPuppeteerOptions = {
    timeout: 60_000
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
        return await puppeteer.launch(puppeteerOptions);
    }
    catch (error) {
        const fallbackOptions = await loadFallbackBrowsers();
        for (const fallback of fallbackOptions) {
            if ((options?.product === 'firefox' && fallback.type !== 'firefox') ||
                (options?.product === 'chrome' &&
                    !chromeWebBrowserTypes.includes(fallback.type))) {
                continue;
            }
            try {
                return await puppeteer.launch(Object.assign({}, puppeteerOptions, {
                    project: fallback.type === 'firefox' ? 'firefox' : 'chrome',
                    executablePath: fallback.command
                }));
            }
            catch {
            }
        }
        throw error;
    }
}
export * as puppeteer from 'puppeteer';
