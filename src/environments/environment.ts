import { MEnviroment } from '@mercadona-fwk-front/core/utils/environment';

/**
 * Define here local environment variables
 */
const localEnvironment = {
  production: false
};

const envInstance = new MEnviroment('yourAppName', localEnvironment);

export const environment = envInstance.environment;
