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
