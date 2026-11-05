import { Routes } from '@angular/router';
import { Admin } from './pages/admin/admin';
import { Portfolio } from './pages/portfolio/portfolio';
import { Login } from './pages/login/login';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Portfolio
    },
    {
        path: 'login',
        component: Login
    },
    { path: 'admin', component: Admin, canActivate: [authGuard] },
    {
        path: '**',
        redirectTo: ''
    }
];
