import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Filme } from '../../models/filme.model';
import { FilmeService } from '../../service/filme.service';
import { Sessao } from '../../models/sessao.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss'
})
export class MovieDetail implements OnInit{
  filme$!: Observable<Filme>;
  sessoes$!: Observable<Sessao[]>;

  constructor(
    private route: ActivatedRoute,
    private filmeService: FilmeService
  ) {}
  
  ngOnInit(): void {
    const tituloSlug = this.route.snapshot.paramMap.get('titulo');

    if (tituloSlug) {
      const tituloOriginal = tituloSlug.replace(/-/g, ' ');
      this.filme$ = this.filmeService.getFilmeByTitulo(tituloOriginal).pipe(
        tap(filme => {
          if (filme && filme.id) {
            this.sessoes$ = this.filmeService.getSessoesByFilmeId(filme.id);
          }
        })
      );
    } else {
      console.error('Titulo do filme não encontrado na rota.');
    }
  }
}
