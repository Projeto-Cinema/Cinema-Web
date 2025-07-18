import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserCreate, UserService } from '../../../service/user.service';

@Component({
  selector: 'app-register-user-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user-component.html',
  styleUrl: './register-user-component.scss'
})
export class RegisterUserComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<any>();

  nome: string = '';
  email: string = '';
  dataNascimento: string = '';
  cpf: string = '';
  telefone: string = '';
  senha: string = '';

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  onClose() {
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

    if (!this.nome || !this.email || !this.dataNascimento || !this.cpf || !this.telefone || !this.senha) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (this.senha.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um email válido.';
      return;
    }

    if (this.userService.cleanCPF(this.cpf).length !== 11) {
      this.errorMessage = 'CPF deve conter 11 dígitos.';
      return;
    }

    const userData: UserCreate = {
      nome: this.nome.trim(),
      email: this.email.trim().toLowerCase(),
      dt_nascimento: this.userService.formatDateToISO(this.dataNascimento),
      cpf: this.userService.cleanCPF(this.cpf),
      telefone: this.userService.cleanTelefone(this.telefone),
      ativo: true,
      tipo: 'cliente',
      senha: this.senha
    };

    console.log(userData);

    this.isLoading = true;

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log('Usuário criado com sucesso:', response);
        this.isLoading = false;

        this.cleanForm();

        this.registerSuccess.emit(response);

        this.close.emit();

        alert('Usuário cadastrado com sucesso!');
      },
      error: (error) => {
        console.log('Erro ao criar usuário:', error);
        this.isLoading = false;

        if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Por favor, verifique os campos.';
        } else if (error.status === 409) {
          this.errorMessage = 'Já existe um usuário cadastrado com este email ou CPF.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        } else {
          this.errorMessage = 'Erro desconhecido. Por favor, tente novamente mais tarde.';
        }
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private cleanForm() {
    this.nome = '';
    this.email = '';
    this.dataNascimento = '';
    this.cpf = '';
    this.telefone = '';
    this.senha = '';
  }

  onLoginClick(event: Event) {
    event.preventDefault();
    this.loginClick.emit();
  }

  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      this.cpf = value;
      event.target.value = value;
    }
  }

  formatTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      this.telefone = value;
      event.target.value = value;
    }
  }
}
