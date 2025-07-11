import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-profile-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile-component.html',
  styleUrl: './user-profile-component.scss'
})
export class UserProfileComponent implements OnInit{
  profileForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private location: Location
  ) {
    this.profileForm = this.fb.group({
      nome: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      dt_nascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      senha: ['']
    });
  }
  
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        const formattedDate = user.dt_nascimento.split('T')[0];

        this.profileForm.patchValue({ ...user, dt_nascimento: formattedDate});
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Não foi possível carregar o perfil do usuário.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.profileForm.getRawValue();

    if (!formData.senha) {
      delete formData.senha;
    }

    this.userService.updateUserProfile(formData).subscribe({
      next: () => {
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.isLoading = false;
        this.profileForm.get('senha')?.reset();
      },
      error: (error) => {
        this.errorMessage = 'Erro ao atualizar o perfil. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
