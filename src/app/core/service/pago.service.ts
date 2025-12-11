import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { LogVisa } from "../interfaz/niuviz";
import { IPagoAprobadoResponse, IPagoRechazadoResponse } from "../interfaz/pago";

@Injectable({ providedIn: 'root' })
export class PagoService {
    constructor( private http:HttpClient ) {}
 
    private apiUrl = `${environment.apiUrl}/complejo-pago`;

    public pagoRechazado(payload:any):Observable<IPagoRechazadoResponse> {
        return this.http.post<IPagoRechazadoResponse>(`${this.apiUrl}/enviar-ticket-rechazado`, payload);
    }

    public pagoAprobado(payload:any):Observable<IPagoAprobadoResponse> {
        return this.http.post<IPagoAprobadoResponse>(`${this.apiUrl}/enviar-ticket-aprobado`, payload);
    }
}