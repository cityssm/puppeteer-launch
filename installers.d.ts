export declare const INSTALLER_TIMEOUT: number;
/**
 * Installs the specified browser for Puppeteer.
 * Times out after 5 minutes.
 * @param browser - The browser to install ('chrome' or 'firefox').
 * @returns A promise that resolves when the installation is complete.
 */
export declare function installBrowser(browser: 'chrome' | 'firefox'): Promise<void>;
/**
 * Installs the Chrome browser for Puppeteer.
 */
export declare function installChromeBrowser(): Promise<void>;
/**
 * Installs the Firefox browser for Puppeteer.
 */
export declare function installFirefoxBrowser(): Promise<void>;
export interface TestInstalledBrowserResult {
    /** Whether the browser is installed and able to launch */
    success: boolean;
    /** Whether the installer was run */
    ranInstaller: boolean;
}
/**
 * Tests if the specified browser is installed.
 * @param browserName - The name of the browser to test ('chrome' or 'firefox').
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns An object containing the installation status and whether the installer was run.
 */
export declare function testInstalledBrowser(browserName: 'chrome' | 'firefox', installIfUnavailable?: boolean): Promise<TestInstalledBrowserResult>;
/**
 * Tests if the Puppeteer Chrome browser is installed.
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns A promise that resolves to an object containing the installation status and whether the installer was run.
 */
export declare function testInstalledChromeBrowser(installIfUnavailable?: boolean): Promise<TestInstalledBrowserResult>;
/**
 * Tests if the Puppeteer Firefox browser is installed.
 * @param installIfUnavailable - Whether to install the browser if it's not available.
 * @returns A promise that resolves to an object containing the installation status and whether the installer was run.
 */
export declare function testInstalledFirefoxBrowser(installIfUnavailable?: boolean): Promise<TestInstalledBrowserResult>;
