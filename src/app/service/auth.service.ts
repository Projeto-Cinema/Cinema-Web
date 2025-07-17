import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject, Observable } from "rxjs";
import { User, UserService } from "./user.service";

export interface DecodedToken {
    sub: string;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private userService: UserService
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.loadUserOnStartup();
    }

    private loadUserOnStartup(): void {
        if (this.isBrowser) {
            const token = this.getToken();
            if (token) {
                this.processTokenAndFetchUser(token);
            }
        }
    }

    handleLogin(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem('access_token', token);
        }
        this.processTokenAndFetchUser(token);
    }

    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem('access_token');
        }
        this.currentUserSubject.next(null);
    }

    public getCurrentUserValue(): User | null {
        return this.currentUserSubject.getValue();
    }

    private processTokenAndFetchUser(token: string): void {
        try {
            jwtDecode(token);

            this.userService.getUserProfile().subscribe({
                next: (user) => {
                    this.currentUserSubject.next(user);
                },
                error: (err) => {
                    console.error('Erro ao buscar perfil do usuário:', err);
                    this.logout();
                }
            });
        } catch (error) {
            console.error('Token inválido ou expirado', error);
            this.logout();
        }
    }

    private getToken(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem('access_token');
        }

        return null;
    }
}