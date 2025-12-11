import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
     {
        path: '',
        loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES),
    }
    ,
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./dashboard/dasboard.routes').then(m => m.DASHBOARD_ROUTES),
    },
    { path: '**', redirectTo: '' }
];
