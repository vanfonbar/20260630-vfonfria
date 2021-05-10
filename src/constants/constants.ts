// Constantes de la aplicación (variables que no cambian entre entornos)
import { MTranslateConfig } from '@mercadona-fwk-front/core/translate';

interface AppConfig {
  appName: string;
  language: MTranslateConfig;
}

export const appConfig: AppConfig = {
  appName: 'yourAppName',
  language: {
    availableLanguages: ['es'],
    defaultLanguage: 'es'
  }
};
