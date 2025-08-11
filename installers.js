// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-child-process, sonarjs/os-command */
import { exec } from 'node:child_process';
async function installBrowser(browser) {
    // eslint-disable-next-line promise/avoid-new, @typescript-eslint/return-await
    return new Promise((resolve, reject) => {
        exec(`npx puppeteer browsers install ${browser}`, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
export async function installChromeBrowser() {
    await installBrowser('chrome');
}
export async function installFirefoxBrowser() {
    await installBrowser('firefox');
}
