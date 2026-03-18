// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// IMPORTANT: 'zone.js' and 'zone.js/testing' MUST be the first imports.

import 'zone.js';
import 'zone.js/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

document.body.classList.add('base-theme');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  teardown: { destroyAfterEach: true }
});

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideZoneChangeDetection()]
  });
});
