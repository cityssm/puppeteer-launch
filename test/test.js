import assert from 'node:assert';
import puppeteerLaunch from '../index.js';
describe('puppeteer-launch', () => {
    beforeEach(() => {
        console.log('\n');
    });
    it('Launches the default browser', async () => {
        const browser = await puppeteerLaunch();
        const browserVersion = await browser.version();
        await browser.close();
        console.log(`Browser: ${browserVersion}`);
        assert.ok(true);
    });
    it('Launches a Chrome-based browser', async () => {
        const browser = await puppeteerLaunch({
            product: 'chrome'
        });
        const browserVersion = await browser.version();
        await browser.close();
        console.log(`Browser: ${browserVersion}`);
        assert.match(browserVersion, /Chrome\//g);
    });
    it('Launches a Firefox browser', async () => {
        const browser = await puppeteerLaunch({
            product: 'firefox'
        });
        const browserVersion = await browser.version();
        await browser.close();
        console.log(`Browser: ${browserVersion}`);
        assert.match(browserVersion, /Firefox\//g);
    });
    it('Launches a browser when the executablePath is invalid', async () => {
        const browser = await puppeteerLaunch({
            executablePath: 'D:\\invalid\\path\\browser.exe'
        });
        const browserVersion = await browser.version();
        await browser.close();
        console.log(`Browser: ${browserVersion}`);
        assert.ok(true);
    });
});
