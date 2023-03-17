// IMPORTANT: Constants in this file are defining the immutable configuration of the application.
// This values do not change with the environment.
// They always have the same value regardless of the environment in which the application is running.

import { AppConfig } from './app-config.interface';

// appName and appVersion will be replaced during CI execution
export const APP_CONFIG: AppConfig = {
  appName: 'yourAppName',
  language: {
    availableLanguages: ['es'],
    defaultLanguage: 'es'
  }
};
