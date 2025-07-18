import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { Filme, Genero } from '../../models/filme.model';
import { FilmeService } from '../../service/filme.service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent implements OnInit {
  filmesEmCartaz$!: Observable<Filme[]>;
  filmeDestaque$!: Observable<Filme | undefined>;

  constructor(private filmeService: FilmeService) {}

  ngOnInit(): void {
    const todosFilmes$ = this.filmeService.getFilmes().pipe(
      map(filmes => filmes.filter(filme => filme.em_cartaz)),
      shareReplay(1)
    );

    this.filmeDestaque$ = todosFilmes$.pipe(
      map(filmes => filmes[0])
    );

    this.filmesEmCartaz$ = todosFilmes$;
  }

  createSlug(title: string): string {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  }

  formatarGeneros(generos: Genero[]): string {
    if (!generos || generos.length === 0) {
      return '';
    }
    return generos.map(g => g.nome).join(', ');
  }
}
