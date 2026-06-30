import { MLoggerLevel } from '@mercadona/core/logger';
import { MPlatformEnvironment } from '@mercadona/core/platform';
import { MEnvironment } from '@mercadona/core/utils/environment';

/**
 * Do not duplicate this file into environment.dev.ts, environment.itg.ts, ...
 * Define here ONLY localhost environment variables.
 *
 * For DEV, ITG, PRE & PRO environments copy this content to the chart files
 * charts/env/values-<env>.yaml
 */
const localEnvironment = {
  logLevel: MLoggerLevel.TRACE,
  env: 'local' as MPlatformEnvironment,
  apiUrl: 'http://localhost:3000'
};

const envInstance = new MEnvironment('yourAppName', localEnvironment);

export const environment = envInstance.environment;
