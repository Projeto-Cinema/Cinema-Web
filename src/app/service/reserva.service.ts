import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { Reserva, ReservaCreate } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private http: HttpClient) { }

  createReserva(reservaData: ReservaCreate): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.apiUrl}/reservas/`, reservaData);
  }

  getReservaById(reservaId: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/reservas/${reservaId}`);
  }
}
