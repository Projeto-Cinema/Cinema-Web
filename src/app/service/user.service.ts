import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export interface User {
    nome: string;
    email: string;
    dt_nascimento: string;
    cpf: string;
    telefone: string;
    ativo: boolean;
    tipo: string;
    senha: string;
}

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

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = AppConfig.apiUrl + AppConfig.endpoints.users;

    constructor(private http: HttpClient) {}

    createUser(userData: User): Observable<UserResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<UserResponse>(this.apiUrl, userData, { headers });
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
}