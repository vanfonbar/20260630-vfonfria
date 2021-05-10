import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeToFwkaComponent } from './welcome-to-fwka.component';

const routes: Routes = [{ path: '', component: WelcomeToFwkaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeToFwkaRoutingModule {
}
