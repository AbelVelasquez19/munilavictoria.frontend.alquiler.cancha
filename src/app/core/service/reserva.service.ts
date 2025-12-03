import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { IReservaCancelarRequest, IReservaDetalleRequest, IReservaDetalleResponse, IReservaRegistrarRequest, IReservaRegistrarResponse, IReservarLiberarReservaExpirdaResponse } from '../interfaz/reserva';

@Injectable({ providedIn: 'root' })
export class ReservaService {

    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/reserva`;

    public registrarReserva(payload:IReservaRegistrarRequest):Observable<IReservaRegistrarResponse> {
        return this.http.post<IReservaRegistrarResponse>(`${this.apiUrl}/registrar-reserva`, payload);
    }

    public cancelarReserva(payload:IReservaCancelarRequest):Observable<IReservaRegistrarResponse> {
        return this.http.post<IReservaRegistrarResponse>(`${this.apiUrl}/cancelar-reserva`,payload);
    }

    public deatalleReserva(payload:IReservaDetalleRequest):Observable<IReservaDetalleResponse> {
        return this.http.post<IReservaDetalleResponse>(`${this.apiUrl}/detalle-reserva`, payload);
    }

    public liberarReservaExpirada():Observable<IReservarLiberarReservaExpirdaResponse> {
        return this.http.get<IReservarLiberarReservaExpirdaResponse>(`${this.apiUrl}/liberar-reserva-expirada`);
    }

    //1 TEMPORAL → cuando el usuario entra a pagar
    //2 PAGADA → pago exitoso (Niubiz)
    //3 CANCELADA → el usuario canceló manual
    //4 EXPIRADA → el sistema la eliminó por tiempo

}