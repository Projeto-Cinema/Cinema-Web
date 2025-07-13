import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sessao } from "../models/sessao.model";
import { Sala } from "../models/sala.model";

@Injectable({
    providedIn: 'root'
})
export class SessaoService {
    private apiURL = AppConfig.apiUrl;

    constructor(private http: HttpClient) {}

    getSessaoById(sessionID: number): Observable<Sessao> {
        return this.http.get<Sessao>(`${this.apiURL}/session/${sessionID}`);
    }

    getSalaById(salaID: number): Observable<Sala> {
        return this.http.get<Sala>(`${this.apiURL}/room/${salaID}`);
    }
}