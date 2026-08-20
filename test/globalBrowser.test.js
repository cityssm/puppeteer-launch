import assert from 'node:assert';
import { describe, it } from 'node:test';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js';
import { GlobalBrowser } from '../globalBrowser.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
async function sleep(ms) {
    // eslint-disable-next-line promise/avoid-new
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
await describe('puppeteer-launch', async () => {
    await it('Launches a shared default browser', async () => {
        const idleMillis = 2000; // 2 seconds
        const globalBrowser = new GlobalBrowser({
            headless: false
        }, idleMillis); // Set idle timeout to 2 seconds for testing
        // Get a browser instance and verify it launched
        let browser;
        try {
            browser = await globalBrowser.getBrowser(false);
        }
        catch {
            assert.fail('Expected to get a browser instance without waiting, but it failed.');
        }
        let page = await browser.newPage();
        await page.goto('https://saultstemarie.ca');
        await sleep(idleMillis + 1000); // Wait to ensure the browser is still active
        // Attempt to get a second browser instance without waiting, which should throw an error
        try {
            await globalBrowser.getBrowser(false);
            assert.fail('Expected an error to be thrown when trying to get a second browser instance without waiting.');
        }
        catch (error) {
            assert.ok(error instanceof Error, 'Expected an error to be thrown');
        }
        // Release the browser and verify that we can get a new instance without waiting
        await globalBrowser.releaseBrowser();
        await sleep(idleMillis - 1000); // Wait to ensure the browser is released but active
        try {
            browser = await globalBrowser.getBrowser(false);
        }
        catch {
            assert.fail('Expected to get a returned browser instance without waiting, but it failed.');
        }
        page = await browser.newPage();
        await page.goto('https://saultstemarie.ca');
        await globalBrowser.releaseBrowser();
        await sleep(idleMillis + 1000); // Wait to ensure the browser is closed due to idle timeout
        // Attempt to get a new browser instance after the idle timeout, which should launch a new browser
        try {
            browser = await globalBrowser.getBrowser(false);
        }
        catch {
            assert.fail('Expected to get a new browser instance after idle timeout, but it failed.');
        }
        page = await browser.newPage();
        await page.goto('https://saultstemarie.ca');
        await globalBrowser.releaseBrowser();
        await globalBrowser.closeBrowser();
    });
});
