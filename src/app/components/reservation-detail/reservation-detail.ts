import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemReserva, ReservaCreate } from '../../models/reserva.model';
import { Router } from '@angular/router';
import { ReservaService } from '../../service/reserva.service';
import { AuthService } from '../../service/auth.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { Assento } from '../../models/sala.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-detail.html',
  styleUrl: './reservation-detail.scss'
})
export class ReservationDetail implements OnInit {
  reservaForm: FormGroup;
  isLoading = false;
  
  // Dados recebidos da página anterior
  private sessaoId!: number;
  private selectedSeats: Assento[] = [];
  private precoBase!: number;
  
  valorTotal = 0;
  dataAtual: Date;

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private authService: AuthService
  ) {
    this.dataAtual = new Date();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      sessaoId: number;
      selectedSeats: Assento[];
      precoBase: number;
    };

    if (state) {
      this.sessaoId = state.sessaoId;
      this.selectedSeats = state.selectedSeats;
      this.precoBase = state.precoBase;
      this.valorTotal = this.selectedSeats.length * this.precoBase;
    } else {
      this.router.navigate(['/']);
    }
    
    this.reservaForm = this.fb.group({
      metodo_pagamento: ['pix', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reservaForm.invalid) return;

    this.isLoading = true;
    const currentUser = this.authService.getCurrentUserValue();

    if (!currentUser || !currentUser.id) {
      alert('Erro: Usuário não encontrado.');
      this.isLoading = false;
      return;
    }

    const reservaData: ReservaCreate = {
      data_reserva: this.dataAtual.toISOString(),
      status: 'pendente',
      metodo_pagamento: this.reservaForm.value.metodo_pagamento,
      valor_total: this.valorTotal,
      usuario_id: currentUser.id,
      sessao_id: this.sessaoId,
      itens: []
    };

    this.reservaService.createReserva(reservaData).pipe(
      switchMap(novaReserva => {
        const addItemObservables = this.selectedSeats.map(assento => {
          const itemData: ItemReserva = {
            item_id: assento.id,
            tipo: 'assento',
            quantidade: 1,
            preco_unitario: this.precoBase,
            preco_total: this.precoBase,
            desconto: 0
          };

          return this.reservaService.addItemToReserva(novaReserva.id, itemData);
        });

        return addItemObservables.length > 0 ? forkJoin(addItemObservables) : of([]);
      })
    ).subscribe({
      next: () => {
        alert('Reserva criada com sucesso!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao criar reserva:', err);
        alert('Erro ao criar reserva. Tente novamente mais tarde.');
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
