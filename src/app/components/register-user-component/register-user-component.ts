import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-user-component',
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

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSubmit() {
    if (!this.nome || !this.email || !this.dataNascimento || !this.cpf || !this.telefone || !this.senha) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const dadosRegistro = {
      nome: this.nome,
      email: this.email,
      dataNascimento: this.dataNascimento,
      cpf: this.cpf,
      telefone: this.telefone,
      senha: this.senha
    };

    console.log(dadosRegistro);

    this.registerSuccess.emit(dadosRegistro);
    alert('Funcionalidade de registro ainda não implementada. Dados registrados no console.');
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
