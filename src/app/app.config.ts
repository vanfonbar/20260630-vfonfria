import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { APP_METADATA } from '@constants';
import { environment } from '@environment';

import { provideMLogger } from '@mercadona/core/logger';
import { provideMPlatform } from '@mercadona/core/platform';
import { provideMTelemetry } from '@mercadona/core/telemetry';
import { provideMTranslate } from '@mercadona/core/translate';
import { provideMErrorHandler } from '@mercadona/core-ui/error-handler';
import { provideMPageError } from '@mercadona/core-ui/page-error';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideMErrorHandler(),
    provideMPageError(),
    provideMTelemetry(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    provideMPlatform({
      appName: APP_METADATA.appName,
      environment: environment.env
    }),
    provideMTranslate(APP_METADATA.language),
    provideMLogger(environment.logLevel),
    provideBrowserGlobalErrorListeners()
  ]
};
