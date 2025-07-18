import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reserva } from '../../models/reserva.model';
import { ReservaService } from '../../service/reserva.service';
import { PagamentoCreate } from '../../models/pagamento.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-reservation-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-details-modal.html',
  styleUrl: './reservation-details-modal.scss'
})
export class ReservationDetailsModal {
  @Input() isOpen: boolean = false;
  @Input() reserva: Reserva | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  isProcessing: boolean = false;

  constructor(private reservaService: ReservaService) {}

  onClose(): void {
    if (!this.isProcessing) {
      this.close.emit();
    }
  }

  processPagamento(): void {
    if (!this.reserva) return;

    this.isProcessing = true;

    const pagamentoData: PagamentoCreate = {
      reserva_id: this.reserva.id,
      metodo: this.reserva.metodo_pagamento,
      valor: this.reserva.valor_total
    };

    this.reservaService.createPagamento(pagamentoData).pipe(
      switchMap(pagamentoCriado => {
        return this.reservaService.processPagamento(pagamentoCriado.id);
      })
    ).subscribe({
      next: () => {
        alert('Pagamento processado com sucesso!');
        this.isProcessing = false;
        this.paymentSuccess.emit();
      },
      error: (err) => {
        console.error('Erro ao processar pagamento:', err);
        alert('Erro ao processar pagamento. Tente novamente mais tarde.');
        this.isProcessing = false;
      }
    });
  }
}
