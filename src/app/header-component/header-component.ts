import { Component } from '@angular/core';
import { LoginModal } from "../shared/login-modal/login-modal";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-component',
  imports: [LoginModal, CommonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent {
  isLoginModalOpen: boolean = false;

  openLoginModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Opening login modal');

    if (!this.isLoginModalOpen) {
      this.isLoginModalOpen = true;
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
}
