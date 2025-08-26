export declare const chromeName: string;
/**
 * Gets the path to the user's Chrome browser.
 * @returns The path to the user's Chrome browser, or undefined if not found.
 */
export declare function getUserChromePath(): Promise<string | undefined>;
/**
 * Gets the path to the user's Firefox browser.
 * @returns The path to the user's Firefox browser, or undefined if not found.
 */
export declare function getUserFirefoxPath(): Promise<string | undefined>;
