import assert from 'node:assert';
import { describe, it } from 'node:test';
import { debuglog } from 'node:util';
import { DEBUG_NAMESPACE } from '../debug.config.js';
import { installChromeBrowser, installFirefoxBrowser, testInstalledChromeBrowser, testInstalledFirefoxBrowser } from '../index.js';
const debug = debuglog(`${DEBUG_NAMESPACE}:test:installers`);
await describe('puppeteer-launch/installers', async () => {
    await it('Runs Chrome installer', async () => {
        try {
            await installChromeBrowser();
        }
        catch (error) {
            debug('Error installing Chrome browser: %O', error);
        }
        assert.ok(true);
    });
    await it('Runs Firefox installer', async () => {
        try {
            await installFirefoxBrowser();
        }
        catch (error) {
            debug('Error installing Firefox browser: %O', error);
        }
        assert.ok(true);
    });
    await it('Tests and installs Chrome browser if unavailable', async () => {
        const isInstalled = await testInstalledChromeBrowser(true);
        debug('isInstalled: %O', isInstalled);
        assert.ok(isInstalled.success);
    });
    await it('Tests and installs Firefox browser if unavailable', async () => {
        const isInstalled = await testInstalledFirefoxBrowser(true);
        debug('isInstalled: %O', isInstalled);
        assert.ok(isInstalled.success);
    });
});
