import { installFirefoxBrowser } from './installers.js';
try {
    await installFirefoxBrowser();
    console.log('✔️  Firefox browser installed successfully');
}
catch (error) {
    console.error('❌  Error installing Firefox browser:', error);
}
