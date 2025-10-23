import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      {
        path: 'user',
        loadComponent: () => import('./components/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      }
    ]
  },
  {
    path: 'assets',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      {
        path: 'detail/:id',
        loadComponent: () => import('./components/asset-detail/asset-detail.component').then(m => m.AssetDetailComponent)
      },
      {
        path: 'user',
        loadComponent: () => import('./components/user-assets/user-assets.component').then(m => m.UserAssetsComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/admin-assets/admin-assets.component').then(m => m.AdminAssetsComponent)
      }
    ]
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    children: [
      {
        path: 'detail/:id',
        loadComponent: () => import('./components/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
