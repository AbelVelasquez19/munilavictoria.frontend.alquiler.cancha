import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { LogVisa } from "../interfaz/niuviz";

@Injectable({ providedIn: 'root' })
export class NiubizService {
    constructor( private http:HttpClient ) {}
 
     private apiUrl = `${environment.apiUrl}/niubiz`;

    public generarSessionToken(payload:any):Observable<any> {
        return this.http.post(`${this.apiUrl}/generate-session-token`, payload);
    }

    public obtenerNumeroCompra(payload:any): Observable<{opcion:string;}> {
      return this.http.post<{ opcion:string;}>(
        `${this.apiUrl}/visa-numero-compra`,payload
      );
    }

    public registrarLog(log: LogVisa):Observable<any>{
      return this.http.post(`${this.apiUrl}/logs-complejo`, log);
    }
}