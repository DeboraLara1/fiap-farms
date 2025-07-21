import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { DashboardShellComponent } from './pages/dashboard-shell/dashboard-shell.component';
import { EstoqueShellComponent } from './pages/estoque-shell/estoque-shell.component';
import { MetasShellComponent } from './pages/metas-shell/metas-shell.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: DashboardShellComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estoque',
    component: EstoqueShellComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'metas',
    component: MetasShellComponent,
    canActivate: [AuthGuard]
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
