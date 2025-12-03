import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ComplejoAdminRequest, ComplejoAdminResponse } from "../interfaz/comAdmin";

@Injectable({ providedIn: 'root' })
export class ComplejoAdminSerivice {
    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/complejo-admin`;

    public registrarComplejoAdministrador(payload:ComplejoAdminRequest):Observable<ComplejoAdminResponse> {
        return this.http.post<ComplejoAdminResponse>(`${this.apiUrl}/registrar-complejo-admin`, payload);
    }
}