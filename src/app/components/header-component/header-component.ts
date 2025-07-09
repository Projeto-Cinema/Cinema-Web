import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginModal } from "../shared/login-modal/login-modal";
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from "../register-user-component/register-user-component";
import { AuthService, AuthUser } from '../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [LoginModal, CommonModule, RegisterUserComponent],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy{
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;

  currentUser: AuthUser | null = null;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) {}

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
}
