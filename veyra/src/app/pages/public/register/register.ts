import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerData = {
    name: '',
    email: '',
    password: '',
  };

  showPassword = signal(false);
  errorMessage = signal('');

  togglePassword() {
    this.showPassword.update((val) => !val);
  }

  onRegister() {
    this.errorMessage.set('');

    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during registration', err);
        this.errorMessage.set('Failed to register. Please try again.');
      },
    });
  }
}
