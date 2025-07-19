import { Routes } from '@angular/router';
import { authGuard } from './service/auth-guard';
import { HomeComponent } from './components/home-component/home-component';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () => import(
            './components/user/user-profile-component/user-profile-component'
        ).then(m => m.UserProfileComponent)
    },
    {
        path: 'filme/:titulo',
        canActivate: [authGuard],
        data: { RenderMode: RenderMode.Client },
        loadComponent: () => import(
            './components/movie-detail/movie-detail'
        ).then(m => m.MovieDetail)
    },
    {
        path: 'sessao/:id',
        canActivate: [authGuard],
        data: { RenderMode: RenderMode.Client },
        loadComponent: () => import(
            './components/session-detail/session-detail'
        ).then(m => m.SessionDetail)
    },
    {
        path: 'criar-reserva',
        canActivate: [authGuard],
        loadComponent: () => import(
            './components/reservations-component/reservation-detail/reservation-detail'
        ).then(m => m.ReservationDetail)
    },
    {
        path: 'minhas-reservas',
        canActivate: [authGuard],
        loadComponent: () => import(
            './components/reservations-component/my-reservations/my-reservations'
        ).then(m => m.MyReservations)
    },
    {
        path: 'em-cartaz',
        loadComponent: () => import(
            './components/movies-in-theaters/movies-in-theaters'
        ).then(m => m.MoviesInTheaters)
    }
];
