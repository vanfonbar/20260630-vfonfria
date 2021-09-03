import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MPageNotFoundComponent } from '@mercadona/core-ui/page-not-found';

// IMPORTANT: Do not use the "error" route as it will be overwritten by the Core module. More info:
// https://mus.mercadona.com/39eafa15b/p/014302-page-error/b/44f1f3

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(
        (m) => m.HomeModule
      )
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
export class AppRoutingModule {}
