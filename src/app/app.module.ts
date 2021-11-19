import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MErrorHandlerModule } from '@mercadona/core-ui/error-handler';
import { MPlatformModule } from '@mercadona/core/platform';
import { MTranslateModule } from '@mercadona/core/translate';
import { MLoggerModule } from '@mercadona/core/logger';
import { MPageNotFoundModule } from '@mercadona/core-ui/page-not-found';
import { MPageErrorModule } from '@mercadona/core-ui/page-error';
import { AppRoutingModule } from './app-routing.module';
import { APP_CONFIG } from '@constants';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '@environment';

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
      appName: APP_CONFIG.appName
    }),
    MPageNotFoundModule,
    MPageErrorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
