import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  imports: [],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss'
})
export class LoginModal {
  @Input() isOpen: boolean = false;
  @Input() closeModal = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();

  loginForm: any;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginSuccess.emit(this.loginForm.value)
    }
  }
}
