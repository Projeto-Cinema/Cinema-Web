import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject, Observable } from "rxjs";

export interface DecodedToken {
    sub: string;
    exp: number;
}

export interface AuthUser {
    email: string;
    nome: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
    public currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        const token = this.getToken();
        if (token) {
            this.processToken(token);
        }
    }

    handleLogin(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem('access_token', token);
        }
        this.processToken(token);
    }

    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem('access_token');
        }
        this.currentUserSubject.next(null);
    }

    private processToken(token: string): void {
        try {
            const decodedToken: DecodedToken = jwtDecode(token);
            const name = decodedToken.sub.split('@')[0];

            const user: AuthUser = {
                email: decodedToken.sub,
                nome: name
            };

            this.currentUserSubject.next(user);
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