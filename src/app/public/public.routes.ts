import { Routes } from "@angular/router";
import { InicioComponent } from "./inicio/inicio.component";
import { LoginComponent } from "./login/login.component";
import { LoginGuard } from "../core/guards/login.guard";
import { PagoPendienteComponent } from "./pago-pendiente/pago-pendiente.component";

export const PUBLIC_ROUTES: Routes = [
    { 
        path: 'inicio',
        component:InicioComponent,
       
    },
    { 
        path: 'pago-pendiente/:token/:tokenIdCancha',
        component:PagoPendienteComponent,
       
    },
    { 
        path: 'login',
        component:LoginComponent,
        canActivate: [LoginGuard]
    },
    {  path: '', redirectTo: 'inicio', pathMatch: 'full' }
]