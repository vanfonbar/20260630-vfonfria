import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { APP_CONFIG } from '@constants';
import { environment } from '@environment';

import { provideMLogger } from '@mercadona/core/logger';
import { MPlatformModule } from '@mercadona/core/platform';
import { MTelemetryModule } from '@mercadona/core/telemetry';
import { MTranslateModule } from '@mercadona/core/translate';
import { MErrorHandlerModule } from '@mercadona/core-ui/error-handler';
import { MPageErrorModule } from '@mercadona/core-ui/page-error';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    MErrorHandlerModule.forRoot(),
    MTranslateModule.forRoot(APP_CONFIG.language),
    MPlatformModule.forRoot({
      appName: APP_CONFIG.appName,
      environment: environment.env
    }),
    MPageErrorModule.forRoot(),
    MTelemetryModule.forRoot({
      url: environment.telemetryConfig.url,
      traces: environment.telemetryConfig.traces
    })
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideMLogger(environment.logLevel)],
  bootstrap: [AppComponent]
})
export class AppModule {}
