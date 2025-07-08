import { Component } from '@angular/core';
import { LoginModal } from "../shared/login-modal/login-modal";
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from "../register-user-component/register-user-component";

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [LoginModal, CommonModule, RegisterUserComponent],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent {
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;

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
}
