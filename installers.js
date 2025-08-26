// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-child-process, sonarjs/os-command */
import { exec } from 'node:child_process';
import puppeteer from 'puppeteer';
/**
 * Installs the specified browser for Puppeteer.
 * @param browser - The browser to install ('chrome' or 'firefox').
 * @returns A promise that resolves when the installation is complete.
 */
export async function installBrowser(browser) {
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
/**
 * Installs the Chrome browser for Puppeteer.
 */
export async function installChromeBrowser() {
    await installBrowser('chrome');
}
/**
 * Installs the Firefox browser for Puppeteer.
 */
export async function installFirefoxBrowser() {
    await installBrowser('firefox');
}
/**
 * Tests if the specified browser is installed.
 * @param browserName - The name of the browser to test ('chrome' or 'firefox').
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns An object containing the installation status and whether the installer was run.
 */
export async function testInstalledBrowser(browserName, installIfUnavailable = false) {
    let browser;
    try {
        browser = await puppeteer.launch({
            browser: browserName
        });
        return { success: true, ranInstaller: false };
    }
    catch {
        if (installIfUnavailable) {
            await installBrowser(browserName);
            return {
                ...(await testInstalledBrowser(browserName, false)),
                ranInstaller: true
            };
        }
        return { success: false, ranInstaller: false };
    }
    finally {
        await browser?.close();
    }
}
/**
 * Tests if the Puppeteer Chrome browser is installed.
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns A promise that resolves to an object containing the installation status and whether the installer was run.
 */
export async function testInstalledChromeBrowser(installIfUnavailable = false) {
    return await testInstalledBrowser('chrome', installIfUnavailable);
}
/**
 * Tests if the Puppeteer Firefox browser is installed.
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns A promise that resolves to an object containing the installation status and whether the installer was run.
 */
export async function testInstalledFirefoxBrowser(installIfUnavailable = false) {
    return await testInstalledBrowser('firefox', installIfUnavailable);
}
