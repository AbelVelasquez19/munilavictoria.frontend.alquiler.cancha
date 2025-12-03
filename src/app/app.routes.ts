import { Routes } from '@angular/router';

export const routes: Routes = [
     {
        path: '',
        loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES),
    }
    ,
   /*  {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./dashboard/dasboard.route').then(m => m.DASHBOARD_ROUTES),
    }, */
    { path: '**', redirectTo: '' }
];
