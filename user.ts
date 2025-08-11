import {
  type InstalledWebBrowser,
  chromeWebBrowserTypes,
  getInstalledWebBrowsers
} from '@cityssm/web-browser-info'

let browsersLoaded = false
let chromeBrowsers: InstalledWebBrowser[] = []
let firefoxBrowsers: InstalledWebBrowser[] = []

async function loadUserBrowsers(): Promise<void> {
  if (!browsersLoaded) {
    /*
     * Load Chrome first
     */

    const fallbackChromeBrowsers = await getInstalledWebBrowsers(
      chromeWebBrowserTypes,
      110
    )

    chromeBrowsers = fallbackChromeBrowsers

    /*
     * Load Firefox
     */

    const fallbackFirefoxBrowsers = await getInstalledWebBrowsers('firefox')

    firefoxBrowsers = fallbackFirefoxBrowsers

    browsersLoaded = true
  }
}

export async function getUserChromePath(): Promise<string | undefined> {
  await loadUserBrowsers()
  const chromePath = chromeBrowsers[0]?.command
  return chromePath
}

export async function getUserFirefoxPath(): Promise<string | undefined> {
  await loadUserBrowsers()
  const firefoxPath = firefoxBrowsers[0]?.command
  return firefoxPath
}
