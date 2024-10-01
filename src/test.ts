// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// IMPORTANT: 'zone.js/testing' MUST be the first import.

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

document.body.classList.add('base-theme');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: true }
});
