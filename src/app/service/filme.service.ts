import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Filme } from "../models/filme.model";
import { Sessao } from "../models/sessao.model";

@Injectable({
    providedIn: 'root'
})
export class FilmeService {
    private apiURL = AppConfig.apiUrl;

    constructor(private http: HttpClient) { }

    getFilmeByTitulo(titulo: string): Observable<Filme> {
        const params = new HttpParams().set('titulo', titulo);
        const searchUrl = `${this.apiURL}/movies/`;

        return this.http.get<Filme>(searchUrl, { params });
    }

    getSessoesByFilmeId(filmeId: number): Observable<Sessao[]> {
        const sessionURL = `${this.apiURL}/session/${filmeId}/sessions/`;

        return this.http.get<Sessao[]>(sessionURL);
    }
}