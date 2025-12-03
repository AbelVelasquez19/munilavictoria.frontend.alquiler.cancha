import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ICanchasRequest, ICanchasResponse } from "../interfaz/canchas";

@Injectable({ providedIn: 'root' })
export class CanchasService {
    constructor(private http: HttpClient) {}
    private apiUrl = `${environment.apiUrl}/canchas`;

    public listarCanchas(payload:ICanchasRequest):Observable<ICanchasResponse> {
        return this.http.post<ICanchasResponse>(`${this.apiUrl}/listar-canchas`, payload);
    }
}