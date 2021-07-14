// IMPORTANTE: Las constantes definidas en este fichero definen la configuración inmutable de la aplicación.
// El valor de las mismas no cambia con el entorno.
// Siempre tienen el mismo valor independientemente del entorno en el que se ejecute la aplicación.
import { AppConfig } from './app-config.interface';

export const APP_CONFIG: AppConfig = {
  appName: 'yourAppName',
  language: {
    availableLanguages: ['es'],
    defaultLanguage: 'es'
  }
};
