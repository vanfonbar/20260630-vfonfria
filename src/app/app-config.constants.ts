/**
 * IMPORTANT: Constants in this file are defining the immutable configuration of the application.
 * These values do not change with the environment.
 * They always have the same value regardless of the environment in which the application is running.
 */

import { MTranslateConfig } from '@mercadona/core/translate';

export type AppMetadataConfig = {
  appName: string;
  language: MTranslateConfig;
};

/**
 * appName and appVersion will be replaced during CI execution
 */
export const APP_METADATA: AppMetadataConfig = {
  appName: 'yourAppName',
  language: {
    availableLanguages: ['es'],
    defaultLanguage: 'es'
  }
};

/**
 * This constant is used as an array to add the icons and download them locally, example of use:
 *
 * export const ... = ['bold/interface-essential/remove-add/remove', 'bold/interface-essential/delete/delete-2', ...]
 *
 * After adding the icons in this way, it would be necessary to execute the instruction
 * `npm run build:pro && npm run add:icons` after this in the `/dist/assets/mercadona` folder,
 * the icons will be downloaded.
 */
export const ICONS_LIST: readonly string[] = [];
