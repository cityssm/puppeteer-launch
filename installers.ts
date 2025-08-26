// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-child-process, sonarjs/os-command */

import { exec } from 'node:child_process'

import puppeteer from 'puppeteer'

import { chromeName } from './user.js'

export const INSTALLER_TIMEOUT = 5 * 60 * 1000

/**
 * Installs the specified browser for Puppeteer.
 * Times out after 5 minutes.
 * @param browser - The browser to install ('chrome' or 'firefox').
 * @returns A promise that resolves when the installation is complete.
 */
export async function installBrowser(
  browser: 'chrome' | 'chromium' | 'firefox'
): Promise<void> {
  // eslint-disable-next-line promise/avoid-new, @typescript-eslint/return-await
  return new Promise((resolve, reject) => {
    exec(
      `npx puppeteer browsers install ${browser}`,
      { timeout: INSTALLER_TIMEOUT },
      (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }
    )
  })
}

/**
 * Installs the Chrome browser for Puppeteer.
 */
export async function installChromeBrowser(): Promise<void> {
  await installBrowser(chromeName)
}

/**
 * Installs the Firefox browser for Puppeteer.
 */
export async function installFirefoxBrowser(): Promise<void> {
  await installBrowser('firefox')
}

export interface TestInstalledBrowserResult {
  /** Whether the browser is installed and able to launch */
  success: boolean

  /** Whether the installer was run */
  ranInstaller: boolean
}

/**
 * Tests if the specified browser is installed.
 * @param browserName - The name of the browser to test ('chrome' or 'firefox').
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns An object containing the installation status and whether the installer was run.
 */
export async function testInstalledBrowser(
  browserName: 'chrome' | 'chromium' | 'firefox',
  installIfUnavailable = false
): Promise<TestInstalledBrowserResult> {
  let browser: puppeteer.Browser | undefined

  try {
    browser = await puppeteer.launch({
      browser: browserName === 'chromium' ? 'chrome' : browserName
    })

    return { success: true, ranInstaller: false }
  } catch {
    if (installIfUnavailable) {
      await installBrowser(browserName)

      return {
        ...(await testInstalledBrowser(browserName, false)),
        ranInstaller: true
      } satisfies TestInstalledBrowserResult
    }

    return { success: false, ranInstaller: false }
  } finally {
    await browser?.close()
  }
}

/**
 * Tests if the Puppeteer Chrome (or Chromium) browser is installed.
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns A promise that resolves to an object containing the installation status and whether the installer was run.
 */
export async function testInstalledChromeBrowser(
  installIfUnavailable = false
): Promise<TestInstalledBrowserResult> {
  return await testInstalledBrowser(chromeName, installIfUnavailable)
}

/**
 * Tests if the Puppeteer Firefox browser is installed.
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns A promise that resolves to an object containing the installation status and whether the installer was run.
 */
export async function testInstalledFirefoxBrowser(
  installIfUnavailable = false
): Promise<TestInstalledBrowserResult> {
  return await testInstalledBrowser('firefox', installIfUnavailable)
}
