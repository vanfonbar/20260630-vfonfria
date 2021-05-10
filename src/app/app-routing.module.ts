import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MPageNotFoundComponent } from '@mercadona-fwk-front/core-ui/page-not-found';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/welcome-to-fwka/welcome-to-fwka.module').then(m => m.WelcomeToFwkaModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: MPageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
