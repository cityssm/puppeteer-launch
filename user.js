import hasPackage from '@cityssm/has-package';
let browsersLoaded = false;
let chromeBrowsers = [];
let firefoxBrowsers = [];
async function loadUserBrowsers() {
    if (!await hasPackage('@cityssm/web-browser-info')) {
        return;
    }
    const { chromeWebBrowserTypes, getInstalledWebBrowsers } = await import('@cityssm/web-browser-info');
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
/**
 * Gets the path to the user's Chrome browser.
 * @returns The path to the user's Chrome browser, or undefined if not found.
 */
export async function getUserChromePath() {
    await loadUserBrowsers();
    const chromePath = chromeBrowsers[0]?.command;
    return chromePath;
}
/**
 * Gets the path to the user's Firefox browser.
 * @returns The path to the user's Firefox browser, or undefined if not found.
 */
export async function getUserFirefoxPath() {
    await loadUserBrowsers();
    const firefoxPath = firefoxBrowsers[0]?.command;
    return firefoxPath;
}
