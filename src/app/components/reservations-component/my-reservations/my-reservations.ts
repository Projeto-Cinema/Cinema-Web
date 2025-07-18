import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Reserva } from '../../../models/reserva.model';
import { ReservaService } from '../../../service/reserva.service';
import { AuthService } from '../../../service/auth.service';
import { ReservationDetailsModal } from '../reservation-details-modal/reservation-details-modal';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, ReservationDetailsModal],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.scss'
})
export class MyReservations implements OnInit {
  reserva$!: Observable<Reserva[]>;
  
  isModalOpen = false;
  selectedReserva: Reserva | null = null;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser && currentUser.id) {
      this.reserva$ = this.reservaService.getReservasByUserId(currentUser.id);
    }
  }

  openReservaModal(reserva: Reserva): void {
    this.selectedReserva = reserva;
    this.isModalOpen = true;
  }

  closeReservaModal(): void {
    this.isModalOpen = false;
    this.selectedReserva = null;
  }

  onPaymentSuccess(): void {
    this.closeReservaModal();

    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser && currentUser.id) {
      this.reserva$ = this.reservaService.getReservasByUserId(currentUser.id);
    }
  }

}
