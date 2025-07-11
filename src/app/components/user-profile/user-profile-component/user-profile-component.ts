import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserService } from '../../../service/user.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ConfirmationModal } from "../../confirmation-modal/confirmation-modal";

@Component({
  selector: 'app-user-profile-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmationModal],
  templateUrl: './user-profile-component.html',
  styleUrl: './user-profile-component.scss'
})
export class UserProfileComponent implements OnInit{
  profileForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isDeleteModalOpen: boolean = false;

  private currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private location: Location,
    private router: Router
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
        this.currentUser = user;
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

  openDeleteConfirmModal(): void {
    console.log("Abrindo modal de confirmação de exclusão");
    this.isDeleteModalOpen = true;
  }

  closeDeleteConfirmModal(): void {
    this.isDeleteModalOpen = false;
  }

  handleDeleteAccount(): void {
    if (!this.currentUser) {
      this.errorMessage = 'Usuário não encontrado.';
      return;
    }

    this.isLoading = true;
    this.userService.desactivateUser(this.currentUser.id).subscribe({
      next: () => {
        this.closeDeleteConfirmModal();
        alert('Sua conta foi desativada com sucesso.');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = 'Erro ao desativar a conta. Por favor, tente novamente.';
        this.isLoading = false;
        this.closeDeleteConfirmModal();
      }
    });
  }
}
