import { MLoggerLevel } from '@mercadona/core/logger';
import { MEnviroment } from '@mercadona/core/utils/environment';

/**
 * Define here local environment variables
 */
const localEnvironment = {
  production: false,
  logLevel: MLoggerLevel.TRACE
};

const envInstance = new MEnviroment('yourAppName', localEnvironment);

export const environment = envInstance.environment;
