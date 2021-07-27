import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MPageNotFoundComponent } from '@mercadona/core-ui/page-not-found';
import { WelcomeToFwkaComponent } from './pages/welcome-to-fwka/welcome-to-fwka.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: WelcomeToFwkaComponent },
  {
    path: '**',
    component: MPageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
