// Constantes de la aplicación (variables que no cambian entre entornos)
import { AppConfig } from './app-config.interface';

export const APP_CONFIG: AppConfig = {
  appName: 'yourAppName',
  language: {
    availableLanguages: ['es'],
    defaultLanguage: 'es'
  }
};
