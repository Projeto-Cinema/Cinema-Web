import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Sessao } from '../../models/sessao.model';
import { Assento, Sala } from '../../models/sala.model';
import { SessaoService } from '../../service/sessao.service';
import { SalaInfoModal } from "../sala-info-modal/sala-info-modal";

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SalaInfoModal],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss'
})
export class SessionDetail implements OnInit{
  sessao$!: Observable<Sessao>;
  sala$!: Observable<Sala>;

  seatGrid: (Assento | null)[][] = [];
  selectedSeats: string[] = [];

  isSalaModalOpen: boolean = false;
  salaConfirmed: boolean = false;
  currentSala: Sala | null = null;

  String = String;

  currentSessao: Sessao | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessaoService: SessaoService,
    private location: Location
  ) { }
  
  ngOnInit(): void {
    const sessionID = Number(this.route.snapshot.paramMap.get('id'));

    if (sessionID) {
      this.sessao$ = this.sessaoService.getSessaoById(sessionID).pipe(
        tap(sessao => {
          this.currentSessao = sessao;
          this.sala$ = this.sessaoService.getSalaById(sessao.sala_id).pipe(
            tap(sala => {
              this.currentSala = sala;
              this.buildSeatGrid(sala.assentos);
            })
          );
        })
      );
    }
  }

  openSalaModal(): void {
    this.isSalaModalOpen = true;
  }

  handleSalaConfirm(): void {
    this.salaConfirmed = true;
    this.isSalaModalOpen = false;
  }

  closeSalaModal(): void {
    this.isSalaModalOpen = false;
  }

  private buildSeatGrid(assentos: Assento[]): void {
    if (!assentos || assentos.length === 0) {
      this.seatGrid = [];
      return;
    }

    const maxRow = Math.max(...assentos.map(a => a.posicao_y));
    const maxCol = Math.max(...assentos.map(a => a.posicao_x));

    const grid: (Assento | null)[][] = Array(maxRow).fill(null).map(() => Array(maxCol).fill(null));

    for (const assento of assentos) {
      const rowIndex = assento.posicao_y - 1;
      const colIndex = assento.posicao_x - 1;

      if (rowIndex >= 0 && rowIndex < maxRow && colIndex >= 0 && colIndex < maxCol) {
        grid[rowIndex][colIndex] = assento;
      }
    }

    this.seatGrid = grid;
  }

  toggleSeatSelection(assento: Assento | null): void {
    if (!assento || assento.ativo !== 'ativo') return;

    const seatCode = assento.codigo;
    const index = this.selectedSeats.indexOf(seatCode);

    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seatCode);
    }
  }

  getSeatClass(assento: Assento | null): string {
    if (!assento) return 'corridor';
    if (this.selectedSeats.includes(assento.codigo)) return 'selected';
    if (assento.ativo !== 'ativo') return 'ocupied';

    return 'available';
  }

  confirmarSelecao(): void {
    if (this.selectedSeats.length === 0 || !this.currentSessao) {
      alert('Selecione pelo menos um assento.');
      return;
    }
    
    const navigationData = {
      sessaoId: this.currentSessao.id,
      selectedSeats: this.selectedSeats,
      precoBase: this.currentSessao.preco_base
    };

    // Navega para a nova página de criação de reserva,
    // passando os dados de forma segura através do 'state' do roteador.
    this.router.navigate(['/criar-reserva'], { state: navigationData });
  }

  goBack(): void {
    this.location.back();
  }
}
