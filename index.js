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
        debug(`Attempting to launch browser: ${JSON.stringify(puppeteerOptions)}`);
        const browser = await puppeteerLaunch(puppeteerOptions);
        if (browser === undefined) {
            throw new Error('Puppeteer browser is undefined');
        }
        debug('Launched puppeteer browser');
        return browser;
    }
    catch (error) {
        debug('Switching to fallback browsers');
        const fallbackOptions = await loadFallbackBrowsers();
        for (const fallback of fallbackOptions) {
            if ((options?.browser === 'firefox' && fallback.type !== 'firefox') ||
                (options?.browser === 'chrome' &&
                    !chromeWebBrowserTypes.includes(fallback.type))) {
                continue;
            }
            try {
                const fallbackPuppeteerOptions = Object.assign({}, puppeteerOptions, {
                    browser: fallback.type === 'firefox' ? 'firefox' : 'chrome',
                    executablePath: fallback.command
                });
                debug(`Attempting to launch fallback browser: ${JSON.stringify(fallbackPuppeteerOptions)}`);
                const browser = await puppeteerLaunch(fallbackPuppeteerOptions);
                debug('Launched fallback browser');
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
