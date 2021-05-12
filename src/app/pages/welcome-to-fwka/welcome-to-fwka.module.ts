import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeToFwkaRoutingModule } from './welcome-to-fwka-routing.module';
import { WelcomeToFwkaComponent } from './welcome-to-fwka.component';

@NgModule({
  declarations: [WelcomeToFwkaComponent],
  imports: [CommonModule, WelcomeToFwkaRoutingModule]
})
export class WelcomeToFwkaModule {}
