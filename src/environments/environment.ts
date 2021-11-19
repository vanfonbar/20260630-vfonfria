import { MLoggerLevel } from '@mercadona/core/logger';
import { MEnviroment } from '@mercadona/core/utils/environment';
import { MPlatformEnvironment } from '@mercadona/core/platform';
/**
 * Define here localhost environment variables.
 * Remember to copy these variables to the chart files for the environment (dev,itg,pre,pro)
 */
const localEnvironment = {
  production: false,
  logLevel: MLoggerLevel.TRACE,
  env: 'local' as MPlatformEnvironment
};

const envInstance = new MEnviroment('yourAppName', localEnvironment);

export const environment = envInstance.environment;
