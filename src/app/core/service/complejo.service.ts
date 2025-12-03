import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { IcomplejoRequest, IComplejoResponse } from "../interfaz/Complejo";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ComplejoService {

    constructor(private http: HttpClient) {}

    private apiUrl = `${environment.apiUrl}/complejo`;

    public listarComepljos(payload:IcomplejoRequest):Observable<IComplejoResponse> {
        return this.http.post<IComplejoResponse>(`${this.apiUrl}/listar-complejo`, payload);
    }
}