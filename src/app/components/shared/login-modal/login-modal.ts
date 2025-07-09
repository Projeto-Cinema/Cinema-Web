import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { UserLogin, UserService } from '../../../service/user.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss'
})
export class LoginModal {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();

  email: string = '';
  password: string = '';

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  onClose() {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.isLoading = false;
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um email válido.';
      return;
    }

    const userLogin: UserLogin = {
      email: this.email.trim().toLowerCase(),
      senha: this.password
    };

    console.log(userLogin);

    this.isLoading = true;

    this.userService.loginUser(userLogin).subscribe({
      next: (response) => {
        console.log('Login com sucesso:', response);

        this.authService.handleLogin(response.access_token);

        this.loginSuccess.emit(response);
        this.onClose();
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);

        if (error.status === 401 || error.status === 400) {
          this.errorMessage = 'Email ou senha inválidos.';
        } else {
          this.errorMessage = 'Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.';
        }
        this.isLoading = false;
      }
    })
  }

  onRegisterClick(event: Event) {
    event.preventDefault();
    this.registerClick.emit();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
