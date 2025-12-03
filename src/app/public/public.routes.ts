import { Routes } from "@angular/router";
import { InicioComponent } from "./inicio/inicio.component";

export const PUBLIC_ROUTES: Routes = [
    { 
        path: 'inicio',
        component:InicioComponent,
    },
    {  path: '', redirectTo: 'inicio', pathMatch: 'full' }
]