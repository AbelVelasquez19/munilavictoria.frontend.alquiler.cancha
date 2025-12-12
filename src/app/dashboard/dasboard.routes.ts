import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { InicioComponent } from "./inicio/inicio.component";
import { AuthGuard } from "../core/guards/auth.guard";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component:LayoutComponent, 
        canActivate: [AuthGuard],
        children: [
            {
                path: 'inicio',
                loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent)
            },
            {
                path: 'complejo',
                loadComponent: () => import('./complejo/complejo.component').then(m => m.ComplejoComponent)
            },
            {
                path: 'reservas',
                loadComponent: () => import('./reservas/reservas.component').then(m => m.ReservasComponent)
            }
        ]
    },
    { path: 'inicio', component: InicioComponent },
]