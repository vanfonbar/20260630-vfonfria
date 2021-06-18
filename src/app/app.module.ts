import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MErrorHandlerModule } from '@mercadona-fwk-front/core-ui/error-handler';
import { MPlatformModule } from '@mercadona-fwk-front/core/platform';
import { MTranslateModule } from '@mercadona-fwk-front/core/translate';
import { APP_CONFIG } from './app-config.constants';
import { MLoggerModule } from '@mercadona-fwk-front/core/logger';
import { MPageNotFoundModule } from '@mercadona-fwk-front/core-ui/page-not-found';
import { MPageErrorModule } from '@mercadona-fwk-front/core-ui/page-error';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    MErrorHandlerModule.forRoot(),
    MTranslateModule.forRoot(APP_CONFIG.language),
    MLoggerModule.forRoot(),
    MPlatformModule.forRoot({
      appName: APP_CONFIG.appName
    }),
    MPageNotFoundModule,
    MPageErrorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
