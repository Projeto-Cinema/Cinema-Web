import { Routes } from '@angular/router';
import { authGuard } from './service/auth-guard';
import { HomeComponent } from './components/home-component/home-component';

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
            './components/user-profile/user-profile-component/user-profile-component'
        ).then(m => m.UserProfileComponent)
    },
    {
        path: 'filme/:titulo',
        canActivate: [authGuard],
        loadComponent: () => import(
            './components/movie-detail/movie-detail'
        ).then(m => m.MovieDetail)
    },
    {
        path: 'sessao/:id',
        canActivate: [authGuard],
        loadComponent: () => import(
            './components/session-detail/session-detail'
        ).then(m => m.SessionDetail)
    }
];
