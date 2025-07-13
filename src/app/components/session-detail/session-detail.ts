import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Sessao } from '../../models/sessao.model';
import { Sala } from '../../models/sala.model';
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

  seatMap: string[][] = [];
  selectedSeats: string[] = [];
  isSalaModalOpen: boolean = false;
  salaConfirmed: boolean = false;
  currentSala: Sala | null = null;

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private location: Location
  ) { }
  
  ngOnInit(): void {
    const sessionID = Number(this.route.snapshot.paramMap.get('id'));

    if (sessionID) {
      this.sessao$ = this.sessaoService.getSessaoById(sessionID).pipe(
        tap(sessao => {
          this.sala$ = this.sessaoService.getSalaById(sessao.sala_id).pipe(
            tap(sala => {
              this.currentSala = sala;
              this.parseSeatMap(sala.mapa_assentos);
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

  private parseSeatMap(mapString: string): void {
    try {
      this.seatMap = JSON.parse(mapString);
    } catch (error) {
      console.error('Erro ao processar o mapa de assentos:', error);
      this.seatMap = [];
    }
  }

  toggleSeatSelection(seatIdentifier: string): void {
    if (seatIdentifier === '_') return;

    const index = this.selectedSeats.indexOf(seatIdentifier);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seatIdentifier);
    }
  }

  getSeatClass(seatIdentifier: string): string {
    if (seatIdentifier === '_') return 'corridor';
    if (this.selectedSeats.includes(seatIdentifier)) return 'selected';
    return 'available';
  }

  confirmarSelecao(): void {
    if (this.selectedSeats.length === 0) {
      alert('Por favor, selecione pelo menos um assento.');
      return;
    }

    console.log('Assentos selecionados:', this.selectedSeats);
  }

  goBack(): void {
    this.location.back();
  }
}
