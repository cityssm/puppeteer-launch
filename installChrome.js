#!/usr/bin/env node
/* eslint-disable no-console */
import { installChromeBrowser } from './installers.js';
try {
    await installChromeBrowser();
    console.log('✔️  Chrome browser installed successfully');
}
catch (error) {
    console.error('❌  Error installing Chrome browser:', error);
}
