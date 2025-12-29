import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { IActualizarTarifaRequest, IListarTarifaRequest, IListarTarrifaResponse, ITarifaRequest, ITarifaResponse } from '../interfaz/tarifa';

@Injectable({ providedIn: 'root' })
export class TarifaService {

    constructor(private http: HttpClient) { }

    private apiUrl = `${environment.apiUrl}/tarifa`;

    public calcularTarifa(payload: ITarifaRequest): Observable<ITarifaResponse> {
        return this.http.post<ITarifaResponse>(`${this.apiUrl}/calcular`, payload);
    }

    public listarTarifa(payload: IListarTarifaRequest): Observable<IListarTarrifaResponse> {
        return this.http.post<IListarTarrifaResponse>(`${this.apiUrl}/listar-tarifa`, payload);
    }

    public actualizarEstadoTarifa(idTarifa: number, estado: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/actualizar-estado-tarifa`, null, {
            params: {
                idTarifa: idTarifa.toString(),
                estado: estado.toString()
            }
        });
    }

    public actualizarTarifa(payload: IActualizarTarifaRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/actualizar-tarifa`, payload);
    }
    
}