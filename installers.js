// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-child-process, sonarjs/os-command */
import { exec } from 'node:child_process';
import Debug from 'debug';
import puppeteer from 'puppeteer';
import { DEBUG_NAMESPACE } from './debug.config.js';
export const INSTALLER_TIMEOUT = 5 * 60 * 1000;
const debug = Debug(`${DEBUG_NAMESPACE}:installers`);
/**
 * Installs the specified browser for Puppeteer.
 * Times out after 5 minutes.
 * @param browser - The browser to install ('chrome' or 'firefox').
 * @returns A promise that resolves when the installation is complete.
 */
export async function installBrowser(browser) {
    // eslint-disable-next-line promise/avoid-new, @typescript-eslint/return-await
    return new Promise((resolve, reject) => {
        exec(`npx puppeteer browsers install ${browser}`, { timeout: INSTALLER_TIMEOUT }, (error, stdout, stderr) => {
            if (stdout !== '') {
                debug('stdout: %s', stdout);
            }
            if (stderr !== '') {
                debug('stderr: %s', stderr);
            }
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
            browser: browserName,
            args: ['--no-sandbox']
        });
        return { success: true, ranInstaller: false };
    }
    catch (error) {
        if (installIfUnavailable) {
            await installBrowser(browserName);
            return {
                ...(await testInstalledBrowser(browserName, false)),
                ranInstaller: true
            };
        }
        debug('Browser not installed: %O', error);
        return { success: false, ranInstaller: false };
    }
    finally {
        await browser?.close();
    }
}
/**
 * Tests if the Puppeteer Chrome (or Chromium) browser is installed.
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
