import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { APP_CONFIG } from '@constants';
import { environment } from '@environment';

import { provideMLogger } from '@mercadona/core/logger';
import { MPlatformModule } from '@mercadona/core/platform';
import { provideMTelemetry } from '@mercadona/core/telemetry';
import { MTranslateModule } from '@mercadona/core/translate';
import { provideMErrorHandler } from '@mercadona/core-ui/error-handler';
import { provideMPageError } from '@mercadona/core-ui/page-error';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    MTranslateModule.forRoot(APP_CONFIG.language),
    MPlatformModule.forRoot({
      appName: APP_CONFIG.appName,
      environment: environment.env
    })
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideMLogger(environment.logLevel),
    provideMErrorHandler(),
    provideMPageError(),
    provideMTelemetry()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
