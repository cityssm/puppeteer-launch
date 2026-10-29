import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { debuglog } from 'node:util';
import { DEBUG_NAMESPACE } from '../debug.config.js';
import puppeteerLaunch from '../index.js';
const debug = debuglog(`${DEBUG_NAMESPACE}:test`);
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
        debug(`Browser: ${browserVersion}`);
        await browser.close();
        assert.ok(!browser.connected, 'Browser should not be connected after closing');
    });
    await it('Launches a Chrome-based browser', async () => {
        const browser = await puppeteerLaunch({
            args: ['--no-sandbox'],
            browserOrder: ['chrome-user', 'chrome']
        });
        const browserVersion = await browser.version();
        debug(`Browser: ${browserVersion}`);
        await browser.close();
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
});
