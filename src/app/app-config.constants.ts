/**
 * IMPORTANT: Constants in this file are defining the immutable configuration of the application.
 * These values do not change with the environment.
 * They always have the same value regardless of the environment in which the application is running.
 */

import { MIconType } from '@mercadona/icons';

import { AppConfig } from './app-config.interface';

/**
 * appName and appVersion will be replaced during CI execution
 */
export const APP_CONFIG: AppConfig = {
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
export const ICONS_LIST: (MIconType | string)[] = [];

/**
 * This constant is the one that allows us to differentiate whether the icons will be read locally or through the bucket.
 * By default, they will be read from the bucket (false) to read locally it must be changed to true.
 */
export const ICONS_LOCAL_MODE: boolean = false;

/**
 * IMPORTANT: Do not change the name of this constant because it is used to run the
 * `npm run build:pro && npm run add:icons` schematic. This constant should only be
 * used in case you have your icons grouped in arrays of strings, example:
 *
 * const icons1 = (MIconType | string) = ['removeBold']
 * const icons2 = (MIconType | string) = ['delete2Bold']
 *
 * export const ... = [icons1, icons2]
 *
 * The icons will appear in the folder `/dist/assets/mercadona`.
 */
export const ICONS_REGISTRY: (MIconType | string)[][] = [];
