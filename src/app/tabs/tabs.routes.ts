import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./listings/listings.page').then((m) => m.ListingsPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: 'more',
        loadComponent: () =>
          import('./more/more.page').then((m) => m.MorePage),
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
