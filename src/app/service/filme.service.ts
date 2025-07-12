import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Filme } from "../models/filme.model";

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
}