import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { DashboardIngresosResponse } from '../interfaz/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/dashboard`;

    public dashboardIngreso(opcion: number, fechaInicio: string | null, fechaFin: string | null):Observable<DashboardIngresosResponse> {
        return this.http.post<DashboardIngresosResponse>(`${this.apiUrl}/ingresos-reservas-reportes`, null ,{
            params: {
                opcion: opcion,
                fechaInicio: fechaInicio ?? '',
                fechaFin: fechaFin ?? ''
            }
        });
    }
}