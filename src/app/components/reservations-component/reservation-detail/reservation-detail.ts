import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemReserva, ReservaCreate } from '../../../models/reserva.model';
import { Router } from '@angular/router';
import { ReservaService } from '../../../service/reserva.service';
import { AuthService } from '../../../service/auth.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Assento } from '../../../models/sala.model';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../service/produto.service';

interface ProdutoCarrinho {
  produto: Produto;
  quantidade: number;
}

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
  
  produtosDisponiveis$!: Observable<Produto[]>;
  produtosCarrinho: ProdutoCarrinho[] = [];
  valorTotal = 0;
  dataAtual: Date;

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private produtoService: ProdutoService,
    private authService: AuthService
  ) {
    this.dataAtual = new Date();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      sessaoId: number;
      selectedSeats: Assento[];
      precoBase: number;
      cinemaId: number;
    };

    if (state && state.cinemaId) {
      this.sessaoId = state.sessaoId;
      this.selectedSeats = state.selectedSeats;
      this.precoBase = state.precoBase;

      this.produtosDisponiveis$ = this.produtoService.getProdutos().pipe(
        map(produtos => {
          return produtos.filter(produto => produto.disponivel && produto.cinema_id === state.cinemaId);
        })
      );

      this.recalcularValorTotal();
    } else {
      this.router.navigate(['/']);
    }
    
    this.reservaForm = this.fb.group({
      metodo_pagamento: ['pix', Validators.required]
    });
  }

  ngOnInit(): void {}

  adicionarProduto(produto: Produto): void {
    const itemExiste = this.produtosCarrinho.find(item => item.produto.id === produto.id);
    if (itemExiste) {
      itemExiste.quantidade++;
    } else {
      this.produtosCarrinho.push({ produto, quantidade: 1 });
    }

    this.recalcularValorTotal();
  }

  removerProduto(produtoId: number): void {
    const itemIndex = this.produtosCarrinho.findIndex(item => item.produto.id === produtoId);
    if (itemIndex > -1) {
      const item = this.produtosCarrinho[itemIndex];
      item.quantidade--;
      if (item.quantidade <= 0) {
        this.produtosCarrinho.splice(itemIndex, 1);
      }
    }

    this.recalcularValorTotal();
  }

  getQuantidadeProduto(produtoId: number): number {
    return this.produtosCarrinho.find(item => item.produto.id === produtoId)?.quantidade || 0;
  }

  recalcularValorTotal(): void {
    const valorIngressos = this.selectedSeats.length * this.precoBase;
    const valorProdutos = this.produtosCarrinho.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);

    this.valorTotal = valorIngressos + valorProdutos;
  }

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
        const itensAssentos = this.selectedSeats.map(assento => ({
          item_id: assento.id,
          tipo: 'assento' as 'assento',
          quantidade: 1,
          preco_unitario: this.precoBase,
          preco_total: this.precoBase,
          desconto: 0
        }));

        const itensProdutos = this.produtosCarrinho.map(item => ({
          item_id: item.produto.id,
          tipo: 'produto' as 'produto',
          quantidade: item.quantidade,
          preco_unitario: item.produto.preco,
          preco_total: item.produto.preco * item.quantidade,
          desconto: 0
        }));

        const todosItens: ItemReserva[] = [...itensAssentos, ...itensProdutos];

        const addItensObservables = todosItens.map(item => 
          this.reservaService.addItemToReserva(novaReserva.id, item)
        );

        return addItensObservables.length > 0 ? forkJoin(addItensObservables) : of([]);
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
