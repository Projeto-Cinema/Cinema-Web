import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss'
})
export class LoginModal {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();

  email: string = '';
  password: string = '';

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSubmit() {
    if (this.email && this.password) {
      console.log('Login attemp:', { email: this.email, password: this.password });
      this.loginSuccess.emit({ email: this.email, password: this.password });
      this.email = '';
      this.password = '';
    }
  }

  onRegisterClick(event: Event) {
    event.preventDefault();
    alert('Funcionalidade ainda em desenvolvimento!');
  }
}
