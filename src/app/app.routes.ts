import { Routes } from '@angular/router';
import { authGuard } from './service/auth-guard';

export const routes: Routes = [
    {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () => import(
            './components/user-profile/user-profile-component/user-profile-component'
        ).then(m => m.UserProfileComponent)
    },
];
