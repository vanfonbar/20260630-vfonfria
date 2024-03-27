import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { APP_CONFIG, ICONS_LIST, ICONS_LOCAL_MODE } from '@constants';
import { environment } from '@environment';

import { MLoggerModule } from '@mercadona/core/logger';
import { MPlatformModule } from '@mercadona/core/platform';
import { MTelemetryModule } from '@mercadona/core/telemetry';
import { MTranslateModule } from '@mercadona/core/translate';
import { MErrorHandlerModule } from '@mercadona/core-ui/error-handler';
import { MPageErrorModule } from '@mercadona/core-ui/page-error';
import { MPageNotFoundModule } from '@mercadona/core-ui/page-not-found';
import { MIconModule } from '@mercadona/icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MErrorHandlerModule.forRoot(),
    MTranslateModule.forRoot(APP_CONFIG.language),
    MLoggerModule.forRoot({
      logLevel: environment.logLevel
    }),
    MPlatformModule.forRoot({
      appName: APP_CONFIG.appName,
      environment: environment.env
    }),
    MPageNotFoundModule,
    MPageErrorModule.forRoot(),
    MTelemetryModule.forRoot({
      url: environment.telemetryConfig.url,
      traces: environment.telemetryConfig.traces
    }),
    MIconModule.forRoot({
      registry: 'folder',
      icons: ICONS_LIST,
      prodMode: ICONS_LOCAL_MODE
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
