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
  { path: '**', redirectTo: '/login' }
];
