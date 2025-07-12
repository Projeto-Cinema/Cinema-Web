import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Filme } from '../../models/filme.model';
import { FilmeService } from '../../service/filme.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss'
})
export class MovieDetail implements OnInit{
  filme$!: Observable<Filme>;

  constructor(
    private route: ActivatedRoute,
    private filmeService: FilmeService
  ) {}
  
  ngOnInit(): void {
    const tituloSlug = this.route.snapshot.paramMap.get('titulo');

    if (tituloSlug) {
      const tituloOriginal = tituloSlug.replace(/-/g, ' ');
      this.filme$ = this.filmeService.getFilmeByTitulo(tituloOriginal);
    } else {
      console.error('Titulo do filme não encontrado na rota.');
    }
  }
}
