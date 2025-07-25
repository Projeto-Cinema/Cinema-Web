import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface User {
    id: number;
    nome: string;
    email: string;
    dt_nascimento: string;
    cpf: string;
    telefone: string;
    ativo: boolean;
    tipo: string;
    senha: string;
}

export type UserCreate = Omit<User, 'id'>;

export interface UserResponse {
    id?: number;
    nome: string;
    email: string;
    dt_nascimento: string;
    cpf: string;
    telefone: string;
    ativo: boolean;
    tipo: string;
}

export interface UserLogin {
    email: string;
    senha: string;
}

export interface UserLoginResponse {
    access_token: string;
    token_type: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = AppConfig.apiUrl;

    constructor(private http: HttpClient) {}

    createUser(userData: UserCreate): Observable<UserResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const createUserURL = this.apiUrl + AppConfig.endpoints.users; 

        return this.http.post<UserResponse>(createUserURL, userData, { headers });
    }

    loginUser(userLogin: UserLogin): Observable<UserLoginResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const loginURL = this.apiUrl + AppConfig.endpoints.login;
        
        return this.http.post<UserLoginResponse>(loginURL, userLogin, { headers });
    }

    formatDateToISO(dateString: string): string {
        const date = new Date(dateString);

        return date.toISOString();
    }

    cleanCPF(cpf: string): string {
        return cpf.replace(/\D/g, '');
    }

    cleanTelefone(telefone: string): string {
        return telefone.replace(/\D/g, '');
    }

    getUserProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/Users/me`);
    }

    updateUserProfile(userData: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/Users/me`, userData);
    }

    desactivateUser(userID: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/Users/${userID}/deactivate`, {});
    }
}