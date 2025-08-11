import { chromeWebBrowserTypes, getInstalledWebBrowsers } from '@cityssm/web-browser-info';
let browsersLoaded = false;
let chromeBrowsers = [];
let firefoxBrowsers = [];
async function loadUserBrowsers() {
    if (!browsersLoaded) {
        /*
         * Load Chrome first
         */
        const fallbackChromeBrowsers = await getInstalledWebBrowsers(chromeWebBrowserTypes, 110);
        chromeBrowsers = fallbackChromeBrowsers;
        /*
         * Load Firefox
         */
        const fallbackFirefoxBrowsers = await getInstalledWebBrowsers('firefox');
        firefoxBrowsers = fallbackFirefoxBrowsers;
        browsersLoaded = true;
    }
}
export async function getUserChromePath() {
    await loadUserBrowsers();
    const chromePath = chromeBrowsers[0]?.command;
    return chromePath;
}
export async function getUserFirefoxPath() {
    await loadUserBrowsers();
    const firefoxPath = firefoxBrowsers[0]?.command;
    return firefoxPath;
}
