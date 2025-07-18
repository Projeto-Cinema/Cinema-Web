import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Filme, Genero } from '../../models/filme.model';
import { FilmeService } from '../../service/filme.service';

@Component({
  selector: 'app-movies-in-theaters',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movies-in-theaters.html',
  styleUrl: './movies-in-theaters.scss'
})
export class MoviesInTheaters implements OnInit {
  todosFilmes$!: Observable<Filme[]>;

  constructor(private filmeService: FilmeService) {}
  
  ngOnInit(): void {
    this.todosFilmes$ = this.filmeService.getFilmes();
  }

  createSlug(title: string): string {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  }

  formatarGeneros(generos: Genero[]): string {
    if (!generos || generos.length === 0) {
      return '';
    }

    return generos.map(genero => genero.nome).join(', ');
  }
}
