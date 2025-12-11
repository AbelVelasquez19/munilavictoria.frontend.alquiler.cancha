import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ILoginResponse } from "../interfaz/AdminLogin";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/complejo-admin`;
    private tokenKey = 'authToken';
    private userKey = 'userData';

    constructor(private http: HttpClient) { }

    login(payload: { numDocumento: string; password: string }) {
        return this.http.post<ILoginResponse>(`${this.apiUrl}/login-complejo`, payload);
    }

    setSession(token: string, userData: any) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUser(): any {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return token != null && !this.isTokenExpired(token);
    }

    private isTokenExpired(token: string): boolean {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    }
}
