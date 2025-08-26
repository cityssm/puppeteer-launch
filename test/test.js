import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import puppeteerLaunch, { installChromeBrowser, installFirefoxBrowser } from '../index.js';
import { testInstalledChromeBrowser, testInstalledFirefoxBrowser } from '../installers.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test`);
await describe('puppeteer-launch', async () => {
    beforeEach(() => {
        // eslint-disable-next-line no-console
        console.log('\n');
    });
    await it('Launches the default browser', async () => {
        const browser = await puppeteerLaunch({
            args: ['--no-sandbox']
        });
        const browserVersion = await browser.version();
        await browser.close();
        debug(`Browser: ${browserVersion}`);
        assert.ok(true);
    });
    await it('Launches a Chrome-based browser', async () => {
        const browser = await puppeteerLaunch({
            args: ['--no-sandbox'],
            browserOrder: ['chrome-user', 'chrome']
        });
        const browserVersion = await browser.version();
        await browser.close();
        debug(`Browser: ${browserVersion}`);
        assert.match(browserVersion, /chrome\//gi);
    });
    await it('Launches a Firefox browser', async () => {
        const browser = await puppeteerLaunch({
            browser: 'firefox',
            args: ['--no-sandbox']
        });
        const browserVersion = await browser.version();
        await browser.close();
        debug(`Browser: ${browserVersion}`);
        assert.match(browserVersion, /firefox\//gi);
    });
    await it('Runs Chrome installer', async () => {
        await installChromeBrowser();
        assert.ok(true);
    });
    await it('Runs Firefox installer', async () => {
        await installFirefoxBrowser();
        assert.ok(true);
    });
    await it('Tests and installs Chrome browser if unavailable', async () => {
        const isInstalled = await testInstalledChromeBrowser(true);
        debug(isInstalled);
        assert.ok(isInstalled.success);
    });
    await it('Tests and installs Firefox browser if unavailable', async () => {
        const isInstalled = await testInstalledFirefoxBrowser(true);
        debug(isInstalled);
        assert.ok(isInstalled.success);
    });
});
