// IMPORTANT: Constants in this file are defining the immutable configuration of the application.
// This values do not change with the environment.
// They always have the same value regardless of the environment in which the application is running.

import { AppConfig } from './app-config.interface';
import { MIconType } from '@mercadona/icons';

// appName and appVersion will be replaced during CI execution
export const APP_CONFIG: AppConfig = {
  appName: 'yourAppName',
  language: {
    availableLanguages: ['es'],
    defaultLanguage: 'es'
  }
};

// IMPORTANT: Do not change the name of this constant
// This constant is used when running the `npm run add:icons` script.
// In case you want to use icons exported from another file, you will have to create an exported constant with the type `(MIconType | string)[]` and in addition to that
// you will have to add them in this `ICONS_REGISTRY` constant.
export const ICONS_REGISTRY: (MIconType | string)[][] = [];
