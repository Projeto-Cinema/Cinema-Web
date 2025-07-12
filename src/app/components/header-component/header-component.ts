import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginModal } from "../shared/login-modal/login-modal";
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from "../register-user-component/register-user-component";
import { AuthService, AuthUser } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { UserMenuComponent } from "../user-menu-component/user-menu-component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [
    LoginModal,
    CommonModule,
    RegisterUserComponent,
    UserMenuComponent,
    FormsModule
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy{
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isSearchActive: boolean = false;
  searchQuery: string = '';

  currentUser: AuthUser | null = null;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  openLoginModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Opening login modal');

    if (!this.isLoginModalOpen) {
      this.isLoginModalOpen = true;
      this.isRegisterModalOpen = false;
      console.log('isLoginMOdalOpen:', this.isLoginModalOpen);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  closeLoginModal() {
    console.log('Closing login modal');
    this.isLoginModalOpen = false;
  }

  onLoginSuccess(credentails: any) {
    console.log('Login successful:', credentails);
    this.closeLoginModal();
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  onRegisterSuccess(event: any) {
    this.closeRegisterModal();
  }

  switchToRegister() {
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = true;
  }

  switchToLogin() {
    this.isRegisterModalOpen = false;
    this.isLoginModalOpen = true;
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isUserMenuOpen && !this.elementRef.nativeElement.querySelector('.user-section').contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  openSearch(): void {
    this.isSearchActive = true;
  }

  closeSearch(): void {
    this.isSearchActive = false;
    this.searchQuery = '';
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.closeSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentMovieClick(event: Event): void {
    const userSection = this.elementRef.nativeElement.querySelector('.user-section');
    if (this.isUserMenuOpen && userSection && !userSection.contains(event.target)) {
      this.isUserMenuOpen = false;
    }

    const searchContainer = this.elementRef.nativeElement.querySelector('.search-container');
    if (this.isSearchActive && searchContainer && !searchContainer.contains(event.target)) {
      this.closeSearch();
    }
  }
}
