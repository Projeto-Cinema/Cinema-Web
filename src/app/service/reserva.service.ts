import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { ItemReserva, Reserva, ReservaCreate } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private http: HttpClient) { }

  createReserva(reservaData: ReservaCreate): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.apiUrl}/reservas/`, reservaData);
  }

  addItemToReserva(reservaId: number, itemData: ItemReserva): Observable<any> {
    return this.http.post(`${this.apiUrl}/item_reserva/${reservaId}/itens`, itemData);
  }

  getReservaById(reservaId: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/reservas/${reservaId}`);
  }
}
