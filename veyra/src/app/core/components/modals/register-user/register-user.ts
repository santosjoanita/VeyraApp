import { Component, EventEmitter, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/user/auth.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  registerData = {
    name: '',
    email: '',
    password: '',
    role: 'worker',
  };

  isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  closeModal(): void {
    this.close.emit();
    this.resetForm();
    this.cdr.detectChanges();
  }

  handleRegister(): void {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const { role, ...payload } = this.registerData;

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.saved.emit(response);
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error registering new user:', err);
        alert('Failed to register user. Please try again.');
        this.cdr.detectChanges();
      },
    });
  }

  private resetForm(): void {
    this.registerData = {
      name: '',
      email: '',
      password: '',
      role: 'worker',
    };
  }
}
