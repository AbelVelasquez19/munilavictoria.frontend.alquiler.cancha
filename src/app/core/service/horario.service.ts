import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { IDHorariosRequest, IHorariosResponse } from '../interfaz/horarios';

@Injectable({ providedIn: 'root' })
export class HorarioService {

    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/horarios`;

    public listarHorariosCancha(payload:IDHorariosRequest):Observable<IHorariosResponse> {
        return this.http.post<IHorariosResponse>(`${this.apiUrl}/listar-horarios-canchas`, payload);
    }
}