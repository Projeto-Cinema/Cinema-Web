import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Produto } from "../models/produto.model";

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {
    private apiURL = AppConfig.apiUrl;

    constructor(private http: HttpClient) {}

    getProdutos(): Observable<Produto[]> {
        return this.http.get<Produto[]>(`${this.apiURL}/products`);
    }
}