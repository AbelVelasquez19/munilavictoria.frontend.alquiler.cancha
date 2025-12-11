import { Routes } from "@angular/router";
import { InicioComponent } from "./inicio/inicio.component";
import { LoginComponent } from "./login/login.component";
import { LoginGuard } from "../core/guards/login.guard";

export const PUBLIC_ROUTES: Routes = [
    { 
        path: 'inicio',
        component:InicioComponent,
       
    },
    { 
        path: 'login',
        component:LoginComponent,
        canActivate: [LoginGuard]
    },
    {  path: '', redirectTo: 'inicio', pathMatch: 'full' }
]