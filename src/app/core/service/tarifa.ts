import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { IDHorariosRequest, IHorariosResponse } from '../interfaz/horarios';
import { ITarifaRequest, ITarifaResponse } from '../interfaz/tarifa';

@Injectable({ providedIn: 'root' })
export class TarifaService {

    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/tarifa`;

    public calcularTarifa(payload:ITarifaRequest):Observable<ITarifaResponse> {
        return this.http.post<ITarifaResponse>(`${this.apiUrl}/calcular`, payload);
    }
}