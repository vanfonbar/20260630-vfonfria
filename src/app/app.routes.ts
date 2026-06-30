import { Routes } from '@angular/router';

// IMPORTANT: Do not use the "/error" route as it will be overwritten by the Core module. More info:
// https://angular.srv.mercadona.com/latest/core-ui/page-error/info/
// IMPORTANT: Do not use the "/monitoring_nginx" route as it will be overwritten by Nginx Configuration
// IMPORTANT: Do not use the "/callback" as it will be overwritten by the Token module. More info:
// https://angular.srv.mercadona.com/latest/development-prescription/routes/routes-not-permitted/

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    loadComponent: () => import('./presentation/pages/catalog/catalog.page').then((m) => m.CatalogPageComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./presentation/pages/cart/cart.page').then((m) => m.CartPageComponent)
  }
];
