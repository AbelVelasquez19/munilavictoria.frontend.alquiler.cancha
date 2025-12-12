import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ICambiarEstadoHorarioRequest, ICambiarEstadoHorarioResponse, IHorarioMasivoRequest, IHorarioMasivoResponse, IListarAdminReservasRequest, IListarAdminReservasResponse } from "../interfaz/comAdminReservas";

@Injectable({ providedIn: 'root' })
export class ComplejoAdminReservaSerivice {
    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/complejo-admin-reserva`;

    public listarReservasDeportivos(payload: IListarAdminReservasRequest):Observable<IListarAdminReservasResponse> {
        return this.http.post<IListarAdminReservasResponse>(`${this.apiUrl}/listar-reservas`, payload);
    }

    public generarHorariosMasivos(payload:IHorarioMasivoRequest):Observable<IHorarioMasivoResponse> {
        return this.http.post<IHorarioMasivoResponse>(`${this.apiUrl}/generar-horario-masivo`, payload);
    }

    public cambiarEstadoHorario(payload:ICambiarEstadoHorarioRequest):Observable<ICambiarEstadoHorarioResponse> {
        return this.http.post<ICambiarEstadoHorarioResponse>(`${this.apiUrl}/cambiar-estado-horario`, payload);
    }
}